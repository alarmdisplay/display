import { expect, jest, it } from '@jest/globals';
import app from '../../src/app';
import axios from 'axios';
import { CalendarItemData } from '../../src/services/calendar-items/calendar-items.class';
import fs from 'fs/promises';
import path from 'path';

jest.mock('axios');

describe('\'Calendar Items\' service', () => {
  beforeAll(done => {
    app.setup();
    (app.get('databaseReady') as Promise<void>).then(done);
  });

  it('registered the service', () => {
    const service = app.service('calendar-items');
    expect(service).toBeTruthy();
  });

  it('should fetch a calendar feed', async () => {
    const testFeed = await fs.readFile(path.resolve(__dirname, '../feed.ics'), { encoding: 'utf-8' });
    axios.get.mockResolvedValue({ data: testFeed });

    jest.useFakeTimers();
    jest.setSystemTime(1723149778415); // simulate Thu Aug 08 2024 20:42:58 GMT+0000

    const calendarFeedsService = app.service('calendar-feeds');
    await calendarFeedsService.create({ name: 'Test', url: 'https://example.org/testfeed.ics' });

    const service = app.service('calendar-items');
    const items = await service.find({ paginate: false }) as CalendarItemData[];

    expect(axios.get).toHaveBeenCalledWith('https://example.org/testfeed.ics');
    expect(items.length).toBe(9);
    expect(items.filter(item => item.summary === 'Recurring event weekly').length).toBe(5);
    expect(items.filter(item => item.summary === 'Recurring event weekly only twice').length).toBe(2);
    expect(items.filter(item => item.summary === 'Future Event').length).toBe(1);
    expect(items.filter(item => item.summary === 'Past Event').length).toBe(0);
    expect(items.filter(item => item.summary === 'Whole day').length).toBe(1);

    jest.useRealTimers();
  });
});
