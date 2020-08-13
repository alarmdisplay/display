import app from '../../src/app';

describe('\'hub-connector\' service', () => {
  it('registered the service', () => {
    const service = app.service('hub-connector');
    expect(service).toBeTruthy();
  });
});
