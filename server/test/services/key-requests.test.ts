import app from '../../src/app';

describe('\'key-requests\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/key-requests');
    expect(service).toBeTruthy();
  });
});
