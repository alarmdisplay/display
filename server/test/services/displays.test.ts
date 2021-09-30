import app from '../../src/app';

const servicePath = 'api/v1/displays';

describe('\'displays\' service', () => {
  beforeAll(done => {
    app.setup();
    (app.get('databaseReady') as Promise<void>).then(done);

  });
  it('registered the service', () => {
    const service = app.service(servicePath);
    expect(service).toBeTruthy();
  });

  it('creates a Display with just a name', async () => {
    const service = app.service(servicePath);
    const display = await service.create({ name: 'Test-Display' });
    expect(display).toHaveProperty('id');
    expect(display).toHaveProperty('name', 'Test-Display');
    expect(display).toHaveProperty('description', '');
    expect(display).toHaveProperty('active', false);
    expect(display).toHaveProperty('views', []);
  });
});
