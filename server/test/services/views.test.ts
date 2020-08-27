import app from '../../src/app';

describe('\'views\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/views');
    expect(service).toBeTruthy();
  });
});
