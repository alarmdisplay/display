import app from '../../src/app';

describe('\'incidents\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/incidents');
    expect(service).toBeTruthy();
  });
});
