import app from '../../src/app';

describe('\'announcements\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/announcements');
    expect(service).toBeTruthy();
  });
});
