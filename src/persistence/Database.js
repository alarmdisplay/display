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
    // TODO
    return Promise.resolve()
  }
}

module.exports = Database
