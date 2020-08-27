import app from '../../src/app';

describe('\'content-slot-options\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/content-slot-options');
    expect(service).toBeTruthy();
  });
});
