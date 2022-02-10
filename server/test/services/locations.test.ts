import app from '../../src/app';

describe('\'locations\' service', () => {
  beforeAll(done => {
    app.setup();
    (app.get('databaseReady') as Promise<void>).then(done);
  });

  it('registered the service', () => {
    const service = app.service('api/v1/locations');
    expect(service).toBeTruthy();
  });
});
