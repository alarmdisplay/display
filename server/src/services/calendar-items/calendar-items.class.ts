import { MemoryServiceOptions, Service } from 'feathers-memory';
import { Application } from '../../declarations';
import { getLogger } from '../../logger';
import { CalendarFeedData } from '../calendar-feeds/calendar-feeds.class';
import ICAL, { Component, Duration } from 'ical.js';
import axios from 'axios';

interface CalendarItemData {
  uid: string
  summary: string
  startDate: Date
  endDate: Date
  description: string
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

    const vEvents = component.getAllSubcomponents('vevent');
    this.logger.debug('Found %d events', vEvents.length);

    // Convert events to out data model and skip events that have ended already
    const now = Date.now();
    const initialData = vEvents.map((vEvent): CalendarItemData | null => {
      const event = new ICAL.Event(vEvent);
      const endDate = event.endDate.toJSDate();

      if (endDate.valueOf() < now) {
        return null;
      }
      return {
        uid: event.uid,
        summary: event.summary,
        startDate: event.startDate.toJSDate(),
        endDate: endDate,
        description: event.description,
        feedId: feed.id,
      };
    });

    // Bulk create all entries
    await this._create(initialData.filter(item => item !== null) as CalendarItemData[]);

    const refreshInterval = component.getFirstPropertyValue('refresh-interval');
    const feedRefreshIntervalSeconds = (refreshInterval instanceof Duration) ? refreshInterval.toSeconds() : 10800;
    this.logger.debug('Feed %d will be refreshed every %d seconds', feed.id, feedRefreshIntervalSeconds);

    const interval = setInterval(async () => {
      await this.loadFeed(feed);
    }, feedRefreshIntervalSeconds * 1000);
    this.intervals.set(feed.id, interval);
  }

  private async loadFeed(feed: CalendarFeedData): Promise<Component> {
    this.logger.debug('Getting feed', feed.url);
    const response = await axios.get(feed.url);
    const jcalData = ICAL.parse(response.data);
    return new ICAL.Component(jcalData);
  }
}
