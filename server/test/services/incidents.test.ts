import app from '../../src/app';

describe('\'incidents\' service', () => {
  beforeAll(done => {
    app.setup();
    (app.get('databaseReady') as Promise<void>).then(done);
  });

  it('registered the service', () => {
    const service = app.service('api/v1/incidents');
    expect(service).toBeTruthy();
  });
});
