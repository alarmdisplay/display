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
  private urls;

  constructor(options: Partial<MemoryServiceOptions>, app: Application) {
    super(options);
    this.app = app;
    this.intervals = new Map<number, NodeJS.Timeout>();
    this.logger = getLogger('calendar-items');
    this.urls = new Map<number, string>();
  }

  setup(app: Application): void {
    const calendarFeedsService = app.service('calendar-feeds');
    calendarFeedsService.on('created', async (feed: CalendarFeedData) => {
      await this.startWatching(feed);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore TypeScript does not know about the event emitter
      this.emit('bulk-change');
    });
    calendarFeedsService.on('updated', async (feed: CalendarFeedData) => {
      await this.updateFeedUrl(feed);
    });
    calendarFeedsService.on('patched', async (feed: CalendarFeedData) => {
      await this.updateFeedUrl(feed);
    });
    calendarFeedsService.on('removed', async (feed: CalendarFeedData) => {
      await this.stopWatching(feed);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore TypeScript does not know about the event emitter
      this.emit('bulk-change');
    });

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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore TypeScript does not know about the event emitter
    this.emit('bulk-change');
  }

  private async startWatching(feed: CalendarFeedData) {
    // Make sure there is no old interval still running
    if (this.intervals.has(feed.id)) {
      clearInterval(<NodeJS.Timeout>this.intervals.get(feed.id));
    }

    // Try to get the feed and populate the store
    this.urls.set(feed.id, feed.url);
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

  private async stopWatching(feed: CalendarFeedData) {
    // Stop the update interval
    if (this.intervals.has(feed.id)) {
      clearInterval(<NodeJS.Timeout>this.intervals.get(feed.id));
      this.intervals.delete(feed.id);
    }
    await this._remove(null, { query: { feedId: feed.id } });
  }

  private async updateFeedUrl(feed: CalendarFeedData) {
    const currentUrl = this.urls.get(feed.id);
    if (currentUrl !== feed.url) {
      this.urls.set(feed.id, feed.url);
      await this.updateFeed(feed);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore TypeScript does not know about the event emitter
      this.emit('bulk-change');
    }
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
    const url = this.urls.get(feed.id);
    if (!url) {
      throw new Error(`No URL set for feed ${feed.id}`);
    }

    this.logger.debug('Getting feed', url);
    const response = await axios.get(url);
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
