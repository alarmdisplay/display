import {Sequelize} from 'sequelize';
import {Application} from './declarations';
import Umzug from 'umzug';
import * as path from 'path';
import logger from './logger';

export default function (app: Application): void {
  const connectionString = app.get('mysql');
  const sequelize = new Sequelize(connectionString, {
    dialect: 'mysql',
    logging: false,
    define: {
      freezeTableName: true
    }
  });
  const oldSetup = app.setup;

  app.set('sequelizeClient', sequelize);

  // Set up a global Promise to check if the database is ready
  app.set('databaseReady', new Promise(resolve => {
    app.set('databaseReadyResolve', resolve);
  }));

  app.setup = function (...args): Application {
    const result = oldSetup.apply(this, args);

    // Set up data relationships
    const models = sequelize.models;
    Object.keys(models).forEach(name => {
      if ('associate' in models[name]) {
        (models[name] as any).associate(models);
      }
    });

    // Initialize Umzug, used for database migrations
    const umzug = new Umzug({
      migrations: {
        // indicates the folder containing the migration .js files
        path: path.join(__dirname, './migrations'),
        // inject sequelize's QueryInterface in the migrations
        params: [
          sequelize.getQueryInterface(),
          app
        ]
      },
      storage: 'sequelize',
      storageOptions: { sequelize }
    });

    // Migrate and sync to the database
    app.set('sequelizeSync', umzug.up().then(() => {
      logger.info('Database migration successful');
      // Resolve the databaseReady Promise
      app.get('databaseReadyResolve')();
    }).catch((reason: Error) => {
      logger.error('Database migration failed:', reason.message);
    }));

    return result;
  };
}
