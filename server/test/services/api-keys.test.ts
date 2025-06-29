import app from '../../src/app';

describe('\'api-keys\' service', () => {
  beforeAll(done => {
    app.setup();
    (app.get('databaseReady') as Promise<void>).then(done);
  });

  it('registered the service', () => {
    const service = app.service('api-keys');
    expect(service).toBeTruthy();
  });
});
