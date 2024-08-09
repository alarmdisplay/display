import { Sequelize, ConnectionError, Dialect, QueryInterface } from 'sequelize';
import { Application } from './declarations';
import { MigrationParams, SequelizeStorage, Umzug } from 'umzug';
import logger from './logger';

export type Migration = (params: MigrationParams<{ query: QueryInterface, app: Application }>) => Promise<void>;

export default function (app: Application): void {
  const dialect: Dialect = process.env.NODE_ENV === 'test' ? 'sqlite' : 'mysql';
  const connectionString = app.get(dialect);
  if (!connectionString || connectionString === '') {
    throw new Error(`The config '${dialect}' has not been set`);
  }
  if (connectionString === 'MYSQL_URI') {
    throw new Error('The environment variable MYSQL_URI has not been set');
  }
  const sequelize = new Sequelize(connectionString, {
    dialect: dialect,
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
      logger: undefined,
      migrations: {
        glob: ['migrations/*.{js,ts}', { cwd: __dirname }],
        resolve: ({name, path, context}) => {
          if (!path) {
            throw new Error('No support for migrations without a path');
          }

          // eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-require-imports
          const migration = require(path);

          // Always store the migration with the .js suffix
          const jsName = name.replace(/\.ts$/, '.js');

          return {
            name: jsName,
            up: async () => migration.up({context}),
            down: async () => migration.down({context})
          };
        },
      },
      context: {
        query: sequelize.getQueryInterface(),
        app
      },
      storage: new SequelizeStorage({
        sequelize: sequelize,
      }),
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
      // Tear down the existing tables for testing
      if (process.env.NODE_ENV === 'test') {
        logger.debug('Tearing down tables for testing ...');
        return umzug.down();
      }
    }).then(() => {
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
