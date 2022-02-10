import app from '../../src/app';

describe('\'hub-connector\' service', () => {
  beforeAll(done => {
    app.setup();
    (app.get('databaseReady') as Promise<void>).then(done);
  });

  it('registered the service', () => {
    const service = app.service('hub-connector');
    expect(service).toBeTruthy();
  });
});
