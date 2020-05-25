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
  }

  checkStructure (connection) {
    return connection.query(`SELECT value FROM ${this.prefix}options WHERE name = 'db_version'`)
      .then(result => {
        // TODO the table exists and maybe also the DB version
        this.logger.debug(result)
      }, reason => {
        if (reason.errno === 1146) {
          this.logger.warn('Options table does not exist, trying to initialize database')
          return this.initialize(connection)
        }

        throw reason
      })
  }

  initialize (connection) {
    this.logger.info('Initializing database...')
    const tableDefinitions = {
      announcements: '( `id` INT UNSIGNED NOT NULL AUTO_INCREMENT , `title` VARCHAR(200) NOT NULL , `body` TEXT NOT NULL , `important` BOOLEAN NOT NULL DEFAULT FALSE , `valid_from` TIMESTAMP NULL , `valid_to` TIMESTAMP NULL , `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , `updated` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB',
      options: '( `id` int(10) unsigned NOT NULL AUTO_INCREMENT, `name` varchar(100) NOT NULL, `value` text NOT NULL, PRIMARY KEY (`id`), UNIQUE KEY `name` (`name`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'
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
  }
}

module.exports = Database
