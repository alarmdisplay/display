import { MemoryServiceOptions, Service } from 'feathers-memory';
import { Application } from '../../declarations';
import { getLogger } from '../../logger';
import { CalendarFeedData } from '../calendar-feeds/calendar-feeds.class';
import ICAL, { Component, Duration, Time } from 'ical.js';
import axios from 'axios';

enum CalendarItemStatus {
  confirmed = 'confirmed',
  tentative = 'tentative',
  cancelled = 'cancelled'
}

interface CalendarItemData {
  uid: string
  summary: string
  startDate: Date
  endDate: Date
  description: string
  status: CalendarItemStatus
  allDayEvent: boolean
  datetimeStamp: Date
  feedId: number
}

export class CalendarItems extends Service<CalendarItemData> {
  private app: Application;
  private intervals: Map<number, NodeJS.Timeout>;
  private logger;

  constructor(options: Partial<MemoryServiceOptions>, app: Application) {
    super(options);
    this.app = app;
    this.intervals = new Map<number, NodeJS.Timeout>();
    this.logger = getLogger('calendar-items');
  }

  setup(app: Application): void {
    (app.get('databaseReady') as Promise<void>).then(() => {
      return app.service('calendar-feeds').find({ paginate: false }) as Promise<CalendarFeedData[]>;
    }).then(feeds => {
      return this.bulkStartWatching(feeds);
    }).catch(reason => {
      this.logger.error('Could not start watching calendar feeds', reason.message || reason);
    });
  }

  private async bulkStartWatching(feeds: CalendarFeedData[]) {
    for (const feed of feeds) {
      try {
        await this.startWatching(feed);
      } catch (error: any) {
        this.logger.error('Could not start to watch calendar feed %s:', feed.url, error.message);
      }
    }
  }

  private async startWatching(feed: CalendarFeedData) {
    // Make sure there is no old interval still running
    if (this.intervals.has(feed.id)) {
      clearInterval(<NodeJS.Timeout>this.intervals.get(feed.id));
    }

    // Try to get the feed and populate the store
    const component = await this.loadFeed(feed);
    const initialData = this.getUpcomingEvents(component, feed);
    await this._create(initialData);

    const refreshInterval = component.getFirstPropertyValue('refresh-interval');
    const feedRefreshIntervalSeconds = (refreshInterval instanceof Duration) ? refreshInterval.toSeconds() : 10800;
    this.logger.debug('Feed %d will be refreshed every %d seconds', feed.id, feedRefreshIntervalSeconds);

    const interval = setInterval(async () => {
      await this.updateFeed(feed);
    }, feedRefreshIntervalSeconds * 1000);
    this.intervals.set(feed.id, interval);
  }

  private getUpcomingEvents(component: Component, feed: CalendarFeedData): CalendarItemData[] {
    const vEvents = component.getAllSubcomponents('vevent');
    this.logger.debug('Found %d events', vEvents.length);

    // Convert events to our data model and skip events that have ended already
    const now = new Date();
    const items = vEvents.map((vEvent): CalendarItemData | null => {
      const event = new ICAL.Event(vEvent);
      const endDate = event.endDate.toJSDate();

      if (endDate.valueOf() < now.valueOf()) {
        return null;
      }

      let status = CalendarItemStatus.confirmed;
      const statusValue = vEvent.getFirstPropertyValue('status');
      if (statusValue && typeof statusValue === 'string') {
        if (statusValue.toLowerCase() === 'cancelled') {
          status = CalendarItemStatus.cancelled;
        } else if (statusValue.toLowerCase() === 'tentative') {
          status = CalendarItemStatus.tentative;
        }
      }

      const startDate = event.startDate;
      const allDayEvent = startDate.icaltype === 'date';

      return {
        uid: event.uid,
        summary: event.summary,
        startDate: startDate.toJSDate(),
        endDate: endDate,
        description: event.description,
        status: status,
        allDayEvent: allDayEvent,
        datetimeStamp: (vEvent.getFirstPropertyValue('dtstamp') as Time).toJSDate() || now,
        feedId: feed.id,
      };
    });

    return items.filter(item => item !== null) as CalendarItemData[];
  }

  private async loadFeed(feed: CalendarFeedData): Promise<Component> {
    this.logger.debug('Getting feed', feed.url);
    const response = await axios.get(feed.url);
    const jcalData = ICAL.parse(response.data);
    return new ICAL.Component(jcalData);
  }

  private async updateFeed(feed: CalendarFeedData) {
    const component = await this.loadFeed(feed);
    const upcomingEvents = this.getUpcomingEvents(component, feed);

    const receivedUids = upcomingEvents.map(event => event.uid);

    const currentItems = await this.find({ query: { feedId: feed.id }, paginate: false }) as CalendarItemData[];
    const currentUids = currentItems.map(item => item.uid);
    const uidsToRemove = currentUids.filter(uid => !receivedUids.includes(uid));
    if (uidsToRemove.length) {
      this.logger.debug('Removing UIDs', uidsToRemove);
      // Remove items individually, because multi-remove does not emit an event
      const itemsToRemove = await this.find(
        { query: { uid: { $in: uidsToRemove } }, paginate: false }
      ) as CalendarItemData[];
      for (const itemToRemove of itemsToRemove) {
        await this.remove(itemToRemove.uid);
      }
    }

    for (const upcomingEvent of upcomingEvents) {
      if (!currentUids.includes(upcomingEvent.uid)) {
        this.logger.debug('Adding %s', upcomingEvent.summary);
        await this.create(upcomingEvent);
      } else {
        const storedItem = await this._get(upcomingEvent.uid);
        if (new Date(storedItem.datetimeStamp).valueOf() < upcomingEvent.datetimeStamp.valueOf()) {
          this.logger.debug('Updating %s', upcomingEvent.summary);
          await this.update(upcomingEvent.uid, upcomingEvent);
        }
      }
    }
  }
}
