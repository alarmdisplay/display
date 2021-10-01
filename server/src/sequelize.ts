import { Sequelize, ConnectionError } from 'sequelize';
import { Application } from './declarations';
import Umzug from 'umzug';
import * as path from 'path';
import logger from './logger';

export default function (app: Application): void {
  const connectionString = app.get('mysql');
  if (!connectionString || connectionString === '') {
    throw new Error('The config \'mysql\' has not been set');
  }
  if (connectionString === 'MYSQL_URI') {
    throw new Error('The environment variable MYSQL_URI has not been set');
  }
  const sequelize = new Sequelize(connectionString, {
    dialect: 'mysql',
    logging: false,
    define: {
      freezeTableName: true
    }
  });
  const oldSetup = app.setup;

  app.set('sequelizeClient', sequelize);

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
        path: path.resolve(__dirname, './migrations'),
        // Accept ts files in tests
        pattern: process.env.NODE_ENV === 'test' ? /^[^\.]+\.ts$/ : /\.js$/,
        // inject sequelize's QueryInterface in the migrations
        params: [
          sequelize.getQueryInterface(),
          app
        ]
      },
      storage: 'sequelize',
      storageOptions: { sequelize }
    });

    // Retry options for initial database connection
    const retryOptions = {
      timeout: 10000,
      max: Number.parseInt(app.get('dbMaxRetries')) || 5,
      backoffBase: 2000,
      backoffExponent: 1.03,
      match: [ ConnectionError ],
      name: 'Database Connection',
      report: (message: string) => logger.debug(message),
    };

    // Migrate and sync to the database
    app.set('sequelizeSync', sequelize.authenticate({ retry: retryOptions }).then(() => {
      logger.info('Connected to database');
      return umzug.up();
    }, (reason: Error) => {
      logger.error('Database connection failed:', reason.message);
      process.exit(1);
    }).then(() => {
      logger.info('Database migration successful');
      // Resolve the databaseReady Promise
      app.get('databaseReadyResolve')();
    }).catch((reason: Error) => {
      logger.error('Database migration failed:', reason.message);
      process.exit(2);
    }));

    return result;
  };
}
