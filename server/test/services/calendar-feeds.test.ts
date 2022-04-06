import app from '../../src/app';

describe('\'Calendar Feeds\' service', () => {
  it('registered the service', () => {
    const service = app.service('calendar-feeds');
    expect(service).toBeTruthy();
  });
});
