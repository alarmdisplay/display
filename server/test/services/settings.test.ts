import app from '../../src/app';

describe('\'settings\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/settings');
    expect(service).toBeTruthy();
  });
});
