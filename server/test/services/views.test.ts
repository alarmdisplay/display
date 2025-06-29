import app from '../../src/app';

describe('\'views\' service', () => {
  beforeAll(done => {
    app.setup();
    (app.get('databaseReady') as Promise<void>).then(done);
  });

  it('registered the service', () => {
    const service = app.service('views');
    expect(service).toBeTruthy();
  });
});
