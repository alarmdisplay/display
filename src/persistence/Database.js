const log4js = require('log4js')
const mariadb = require('mariadb')

class Database {
  constructor (host, username, password, database, prefix) {
    this.host = host
    this.username = username
    this.password = password
    this.database = database
    this.prefix = prefix

    this.logger = log4js.getLogger('Database')
  }

  /**
   * Connects to the database and makes sure it is ready to be used.
   *
   * @return {Promise}
   */
  start () {
    this.logger.info('Connecting...')
    return mariadb.createConnection({ host: this.host, user: this.username, password: this.password, database: this.database })
      .then(connection => this.checkStructure(connection))
      .then(dbVersion => { this.logger.info('Database version:', dbVersion) })
  }

  /**
   * Checks if the expected database structure is found and triggers an initialization if not
   *
   * @param connection
   *
   * @return {Promise}
   */
  checkStructure (connection) {
    return this.getDatabaseVersion(connection)
      .catch(reason => {
        if (reason.errno === 1146) {
          this.logger.warn('Options table does not exist, trying to initialize database')
          return this.initialize(connection)
            .then(() => this.getDatabaseVersion(connection))
        }

        throw reason
      })
  }

  /**
   * @param connection
   *
   * @return {Promise<Number>}
   */
  getDatabaseVersion (connection) {
    return connection.query(`SELECT value FROM ${this.prefix}options WHERE name = 'db_version'`)
      .then(result => {
        if (result.length === 0) {
          throw new Error('Could not determine database version')
        }

        return parseInt(result[0].value)
      })
  }

  /**
   * Creates all the requires database tables
   *
   * @param connection
   *
   * @return {Promise}
   */
  initialize (connection) {
    this.logger.info('Initializing database...')

    // The table names and the respective definition to create that table
    const tableDefinitions = {
      announcements: '( `id` int(10) unsigned NOT NULL AUTO_INCREMENT, `title` varchar(200) NOT NULL, `body` text NOT NULL, `important` tinyint(1) NOT NULL DEFAULT 0, `valid_from` timestamp NULL DEFAULT NULL, `valid_to` timestamp NULL DEFAULT NULL, `created` timestamp NOT NULL DEFAULT current_timestamp(), `updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(), PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4',
      options: '(`id` int(10) unsigned NOT NULL AUTO_INCREMENT, `name` varchar(100) NOT NULL, `value` text NOT NULL, PRIMARY KEY (`id`), UNIQUE KEY `name` (`name`)) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4'
    }

    // Before tables are created, check if there would be a conflict with existing tables
    const tableNames = Object.keys(tableDefinitions).map(tableName => `${this.prefix}${tableName}`)
    return connection.query(`SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = '${this.database}' AND TABLE_NAME IN ('${tableNames.join("','")}')`)
      .then(result => {
        if (result.length > 0) {
          const existingTableNames = result.map(row => row.TABLE_NAME)
          throw new Error(`Tables that should be created, already exist (${existingTableNames.join(', ')}). Remove them if no longer needed or choose a different prefix or database.`)
        }
      })
      .then(async () => {
        // No conflicts expected, create the tables
        for (const [name, definition] of Object.entries(tableDefinitions)) {
          const tableName = `${this.prefix}${name}`
          this.logger.info(`Creating table ${tableName} ...`)
          await connection.query('CREATE TABLE `' + tableName + '` ' + definition)
        }
      })
      .then(() => {
        // If all went well, we can fill the database with essential data
        return connection.query(`INSERT INTO ${this.prefix}options (name, value) VALUES (?, ?)`, ['db_version', 1])
      })
  }
}

module.exports = Database
