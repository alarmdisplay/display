import app from '../../src/app';

describe('\'settings\' service', () => {
  beforeAll(done => {
    app.setup();
    (app.get('databaseReady') as Promise<void>).then(done);
  });

  it('registered the service', () => {
    const service = app.service('api/v1/settings');
    expect(service).toBeTruthy();
  });
});
