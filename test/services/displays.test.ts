import app from '../../src/app';

describe('\'displays\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/displays');
    expect(service).toBeTruthy();
  });
});
