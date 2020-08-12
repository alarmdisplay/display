import app from '../../src/app';

describe('\'locations\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/locations');
    expect(service).toBeTruthy();
  });
});
