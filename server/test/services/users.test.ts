import app from '../../src/app';

describe('\'users\' service', () => {
  beforeAll(done => {
    app.setup();
    (app.get('databaseReady') as Promise<void>).then(done);
  });

  it('registered the service', () => {
    const service = app.service('users');
    expect(service).toBeTruthy();
  });
});
