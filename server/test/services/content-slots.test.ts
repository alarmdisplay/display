import app from '../../src/app';

describe('\'content-slots\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/content-slots');
    expect(service).toBeTruthy();
  });
});
