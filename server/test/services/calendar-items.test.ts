import app from '../../src/app';

describe('\'Calendar Items\' service', () => {
  it('registered the service', () => {
    const service = app.service('calendar-items');
    expect(service).toBeTruthy();
  });
});
