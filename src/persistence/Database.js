const log4js = require('log4js')
const mariadb = require('mariadb')

const AlertRepository = require('./repositories/AlertRepository')
const AnnouncementRepository = require('./repositories/AnnouncementRepository')
const ContentSlotRepository = require('./repositories/ContentSlotRepository')
const DisplayRepository = require('./repositories/DisplayRepository')
const DuplicateEntryError = require('../errors/DuplicateEntryError')
const ViewRepository = require('./repositories/ViewRepository')

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
   * @return {Promise<{contentSlotRepository: ContentSlotRepository, announcementRepository: AnnouncementRepository, displayRepository: DisplayRepository, viewRepository: ViewRepository, alertRepository: AlertRepository}>}
   */
  async start () {
    this.logger.info('Connecting...')

    // Create a single connection for the startup checks, so we avoid race conditions
    const connection = await mariadb.createConnection({ host: this.host, user: this.username, password: this.password, database: this.database })
    const dbVersion = await this.checkStructure(connection)
    this.logger.info('Database version:', dbVersion)
    // This is the place where we can later check for needed database migrations
    await connection.end()

    // Create a connection pool that the repositories can get connections from
    const pool = await mariadb.createPool({ host: this.host, user: this.username, password: this.password, database: this.database, connectionLimit: 5 })
    this.connectionPool = pool

    return {
      alertRepository: new AlertRepository(this, `${this.prefix}alerts`),
      announcementRepository: new AnnouncementRepository(pool, this.prefix),
      displayRepository: new DisplayRepository(this, `${this.prefix}displays`),
      contentSlotRepository: new ContentSlotRepository(pool, this.prefix),
      viewRepository: new ViewRepository(this, `${this.prefix}views`)
    }
  }

  /**
   * Checks if the expected database structure is found and triggers an initialization if not
   *
   * @param connection
   *
   * @return {Promise<Number>}
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

  async delete (table, where, limit = 0) {
    let connection
    try {
      connection = await this.connectionPool.getConnection()
      const { sql, values } = this.addWhereAndLimit(connection, `DELETE FROM ${connection.escapeId(table)}`, [], where, {}, limit)
      this.logger.debug(sql, values)
      const result = await connection.query(sql, values)
      return result.affectedRows
    } catch (e) {
      throw new Error(e.code || e.message)
    } finally {
      if (connection) {
        connection.release()
      }
    }
  }

  /**
   * Adds the WHERE, ORDER BY, and LIMIT clauses if necessary
   *
   * @param connection
   * @param {String} sql
   * @param {Array} values
   * @param {Object} where
   * @param {Object} orderBy
   * @param {Number} limit
   *
   * @return {{values: Array, sql: String}}
   */
  addWhereAndLimit (connection, sql, values, where = {}, orderBy = {}, limit = 0) {
    const whereParts = []
    for (const [column, value] of Object.entries(where)) {
      if (Array.isArray(value)) {
        whereParts.push(`${connection.escapeId(column)} IN ?`)
      } else {
        whereParts.push(`${connection.escapeId(column)} = ?`)
      }
      values.push(value)
    }

    // Add a where clause if restrictions were given
    if (whereParts.length > 0) {
      sql += ` WHERE ${whereParts.join(' AND ')}`
    }

    const orderByParts = []
    for (const [column, value] of Object.entries(orderBy)) {
      orderByParts.push(connection.escapeId(column) + (value < 0 ? ' DESC' : ''))
    }
    if (orderByParts.length > 0) {
      sql += ` ORDER BY ${orderByParts.join(',')}`
    }

    // Add a limit if we have one
    if (limit > 0) {
      sql += ' LIMIT ?'
      values.push(limit)
    }

    return { sql, values }
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
      displays: '(`id` int(10) unsigned NOT NULL AUTO_INCREMENT, `name` varchar(50) NOT NULL, `active` tinyint(1) NOT NULL DEFAULT 0, `client_id` varchar(8) DEFAULT NULL, `description` text NOT NULL DEFAULT \'\', `location` varchar(100) NOT NULL DEFAULT \'\', PRIMARY KEY (`id`), UNIQUE KEY `client_id` (`client_id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4',
      views: '(`id` int(10) unsigned NOT NULL AUTO_INCREMENT, `display_id` int(10) unsigned NOT NULL, `view_order` int(11) NOT NULL, `screen_type` varchar(20) NOT NULL DEFAULT \'idle\', `columns` tinyint(3) unsigned NOT NULL DEFAULT 1, `rows` tinyint(3) unsigned NOT NULL DEFAULT 1, PRIMARY KEY (`id`), UNIQUE KEY `display_id` (`display_id`,`view_order`,`screen_type`), CONSTRAINT FOREIGN KEY (`display_id`) REFERENCES `' + this.prefix + 'displays` (`id`) ON DELETE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4',
      contentslots: '(`id` int(10) unsigned NOT NULL AUTO_INCREMENT, `view_id` int(10) unsigned NOT NULL, `component_type` varchar(30) NOT NULL, `column_start` tinyint(3) unsigned NOT NULL, `row_start` tinyint(3) unsigned NOT NULL, `column_end` tinyint(3) unsigned NOT NULL, `row_end` tinyint(3) unsigned NOT NULL, PRIMARY KEY (`id`), CONSTRAINT FOREIGN KEY (`view_id`) REFERENCES `' + this.prefix + 'views` (`id`) ON DELETE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4',
      contentslot_options: '(`contentslot_id` int(10) unsigned NOT NULL, `name` varchar(50) NOT NULL, `value` text NOT NULL, UNIQUE KEY `contentslot_id` (`contentslot_id`,`name`), CONSTRAINT FOREIGN KEY (`contentslot_id`) REFERENCES `' + this.prefix + 'contentslots` (`id`) ON DELETE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4',
      alerts: '(`id` int(10) unsigned NOT NULL AUTO_INCREMENT, `title` varchar(200) NOT NULL, `keyword` varchar(100) NOT NULL, `description` text NOT NULL DEFAULT \'\', `time` timestamp NOT NULL DEFAULT current_timestamp(), `location` varchar(250) NOT NULL DEFAULT \'\', `status` varchar(20) NOT NULL, `category` varchar(20) NOT NULL DEFAULT \'Other\', `contact` varchar(150) NOT NULL DEFAULT \'\', `expires` timestamp NULL DEFAULT NULL, `updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(), PRIMARY KEY (`id`)) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4',
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

  /**
   * @param {String} table
   * @param {Object} values
   *
   * @return {Promise<Number>} The ID of the inserted row
   */
  async insert (table, values) {
    let connection
    try {
      connection = await this.connectionPool.getConnection()
      const columnNames = Object.keys(values)
      const escapedColumnNames = columnNames.map(connection.escapeId)
      const valuePlaceholders = Array(columnNames.length).fill('?')
      const sql = `INSERT INTO ${connection.escapeId(table)} (${escapedColumnNames.join(',')}) VALUES (${valuePlaceholders.join(',')})`
      this.logger.debug(sql, values)
      const result = await connection.query(sql, Object.values(values))
      return result.insertId
    } catch (e) {
      if (e.errno === 1062) {
        throw new DuplicateEntryError(e.code)
      }

      throw new Error(e.code || e.message)
    } finally {
      if (connection) {
        connection.release()
      }
    }
  }

  /**
   * @param {String} table
   * @param {String} columns
   * @param {Object} where
   * @param {Object} orderBy
   * @param {Number} limit
   *
   * @return {Promise<Object[]>}
   */
  async select (table, columns = '*', where = {}, orderBy = {}, limit = 0) {
    let connection
    try {
      connection = await this.connectionPool.getConnection()
      const sqlBase = `SELECT ${columns} FROM ${connection.escapeId(table)}`
      const { sql, values } = this.addWhereAndLimit(connection, sqlBase, [], where, orderBy, limit)
      this.logger.debug(sql, values)
      const rows = await connection.query(sql, values)
      return Array.from(rows)
    } catch (e) {
      throw new Error(e.code || e.message)
    } finally {
      if (connection) {
        connection.release()
      }
    }
  }

  /**
   * @param {String} table
   * @param {Object} values
   * @param {Object} where
   * @return {Promise<number>}
   */
  async update (table, values, where = {}) {
    let connection
    try {
      connection = await this.connectionPool.getConnection()
      const columnNames = Object.keys(values)
      const escapedValueAssignments = columnNames.map(column => `${connection.escapeId(column)} = ?`)
      const sqlBase = `UPDATE ${connection.escapeId(table)} SET ${escapedValueAssignments.join(',')}`
      const { sql, values: queryValues } = this.addWhereAndLimit(connection, sqlBase, Object.values(values), where)
      const result = await connection.query(sql, Object.values(queryValues))
      return result.affectedRows
    } catch (e) {
      throw new Error(e.code || e.message)
    } finally {
      if (connection) {
        connection.release()
      }
    }
  }
}

module.exports = Database
