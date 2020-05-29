const Repository = require('./Repository')

class AnnouncementRepository extends Repository {
  /**
   * @param connectionPool
   * @param {String} prefix The prefix used for the database tables
   */
  constructor (connectionPool, prefix) {
    super(connectionPool)
    this.tableName = `${prefix}announcements`
  }

  /**
   * @param {String} title
   * @param {String} body
   * @param {Boolean} important
   * @param {Number} validFrom
   * @param {Number} validTo
   */
  async create (title, body, important, validFrom, validTo) {
    let conn
    try {
      conn = await this.connectionPool.getConnection()
      const result = await conn.query(
        `INSERT INTO ${this.tableName} (\`title\`, \`body\`, \`important\`, \`valid_from\`, \`valid_to\`) VALUES (?,?,?,?,?)`,
        [title, body, important, validFrom, validTo]
      )
      return result.insertId
    } finally {
      if (conn) {
        conn.release()
      }
    }
  }

  /**
   * Returns all items.
   *
   * @return {Promise<Object[]>}
   */
  async getAll () {
    let conn
    try {
      conn = await this.connectionPool.getConnection()
      const rows = await conn.query('SELECT `id`, `title`, `body`, `important`, UNIX_TIMESTAMP(`valid_from`) AS valid_from, UNIX_TIMESTAMP(`valid_to`) AS valid_to, UNIX_TIMESTAMP(`created`) AS created, UNIX_TIMESTAMP(`updated`) AS updated FROM ' + this.tableName)
      return rows.map(this.rowToObject)
    } finally {
      if (conn) {
        conn.release()
      }
    }
  }

  /**
   * @param {Number} id
   *
   * @return {Promise<Object>|Promise<null>}
   */
  async getOne (id) {
    let conn
    try {
      conn = await this.connectionPool.getConnection()
      const rows = await conn.query(`SELECT \`id\`, \`title\`, \`body\`, \`important\`, UNIX_TIMESTAMP(\`valid_from\`) AS valid_from, UNIX_TIMESTAMP(\`valid_to\`) AS valid_to, UNIX_TIMESTAMP(\`created\`) AS created, UNIX_TIMESTAMP(\`updated\`) AS updated FROM ${this.tableName} WHERE id = ? LIMIT 1`, id)
      if (rows.length === 0) {
        return null
      }
      return this.rowToObject(rows[0])
    } finally {
      if (conn) {
        conn.release()
      }
    }
  }

  rowToObject (row) {
    return {
      id: row.id,
      title: row.title || '',
      text: row.body || '',
      important: row.important === 1,
      validFrom: row.valid_from,
      validTo: row.valid_to,
      createdAt: row.created,
      updatedAt: row.updated
    }
  }

  /**
   * @param {Number} id
   * @param {String} title
   * @param {String} text
   * @param {Boolean} important
   * @param {Number} validFrom
   * @param {Number} validTo
   *
   * @return {Promise<Object>|Promise<null>}
   */
  async updateOne (id, title, text, important, validFrom, validTo) {
    let conn
    try {
      conn = await this.connectionPool.getConnection()
      const result = await conn.query(
        `UPDATE ${this.tableName} SET \`title\` = ?, \`body\` = ?, \`important\` = ?, \`valid_from\` = FROM_UNIXTIME(?), \`valid_to\` = FROM_UNIXTIME(?) WHERE \`id\` = ?`,
        [title, text, important, validFrom, validTo, id]
      )
      return result.affectedRows === 1 ? id : null
    } finally {
      if (conn) {
        conn.release()
      }
    }
  }
}

module.exports = AnnouncementRepository
