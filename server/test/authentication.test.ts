import app from '../src/app';

describe('authentication', () => {
  beforeAll(done => {
    app.setup();
    // Wait for the database to be migrated / synced
    (app.get('databaseReady') as Promise<void>).then(done);
  });

  it('registered the authentication service', () => {
    expect(app.service('authentication')).toBeTruthy();
  });

  describe('local strategy', () => {
    const userInfo = {
      email: 'someone@example.com',
      password: 'supersecret'
    };

    beforeAll((done) => {
      // Wait for the database to be migrated / synced
      app.service('users').create(userInfo)
        .then(() => done(), () => {
          // Do nothing, it just means the user already exists and can be tested
          done();
        });
    });

    it('authenticates user and creates accessToken', async () => {
      const { user, accessToken } = await app.service('authentication').create({
        strategy: 'local',
        ...userInfo
      }, {});

      expect(accessToken).toBeTruthy();
      expect(user).toBeTruthy();
    });
  });
});
