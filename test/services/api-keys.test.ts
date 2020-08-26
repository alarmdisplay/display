import app from '../../src/app';

describe('\'api-keys\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/api-keys');
    expect(service).toBeTruthy();
  });
});
