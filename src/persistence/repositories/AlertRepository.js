const Repository = require('./Repository')

class AlertRepository extends Repository {
  /**
   * @param connectionPool
   * @param {String} prefix The prefix used for the database tables
   */
  constructor (connectionPool, prefix) {
    super(undefined, `${prefix}alerts`)
    this.connectionPool = connectionPool
    this.selectFields = '`id`, `title`, `keyword`, `description`, UNIX_TIMESTAMP(`time`) AS time, `location`, `status`, `category`, `contact`, UNIX_TIMESTAMP(`expires`) AS expires, UNIX_TIMESTAMP(`updated`) AS updated'
  }

  /**
   * @param {String} title
   * @param {String} keyword
   * @param {String} description
   * @param {Number} time
   * @param {String} location
   * @param {String} status
   * @param {String} category
   * @param {String} contact
   * @param {Number} expires
   *
   * @return {Promise<Number>}
   */
  async create (title, keyword, description, time, location, status, category, contact, expires) {
    let conn
    try {
      conn = await this.connectionPool.getConnection()
      const result = await conn.query(
        `INSERT INTO ${this.tableName} (\`title\`, \`keyword\`, \`description\`, \`time\`, \`location\`, \`status\`, \`category\`, \`contact\`, \`expires\`) VALUES (?,?,?,FROM_UNIXTIME(?),?,?,?,?,FROM_UNIXTIME(?))`,
        [title, keyword, description, time, location, status, category, contact, expires]
      )
      return result.insertId
    } finally {
      if (conn) {
        conn.release()
      }
    }
  }

  /**
   * @param {Number} id The ID of the item to delete
   *
   * @return {Promise<Number>|Promise<null>} Returns the ID if the item existed before deletion, null otherwise
   */
  async deleteOne (id) {
    let conn
    try {
      conn = await this.connectionPool.getConnection()
      const result = await conn.query(`DELETE FROM ${this.tableName} WHERE id = ? LIMIT 1`, id)
      return (result.affectedRows === 1 ? id : null)
    } finally {
      if (conn) {
        conn.release()
      }
    }
  }

  /**
   * @return {Promise<Object[]>}
   */
  async getAll () {
    let conn
    try {
      conn = await this.connectionPool.getConnection()
      const rows = await conn.query('SELECT ' + this.selectFields + ' FROM ' + conn.escapeId(this.tableName))
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
      const rows = await conn.query('SELECT ' + this.selectFields + ' FROM ' + conn.escapeId(this.tableName) + ' WHERE id = ? LIMIT 1', id)
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
      title: row.title,
      keyword: row.keyword,
      description: row.description,
      time: row.time,
      location: row.location,
      status: row.status,
      category: row.category,
      contact: row.contact,
      expires: row.expires,
      updatedAt: row.updated
    }
  }
}

module.exports = AlertRepository
