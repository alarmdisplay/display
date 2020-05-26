const DuplicateEntryError = require('../../errors/DuplicateEntryError')

class DisplayRepository {
  /**
   * @param connectionPool
   * @param {String} prefix The prefix used for the database tables
   */
  constructor (connectionPool, prefix) {
    this.connectionPool = connectionPool
    this.tableName = `${prefix}displays`
  }

  /**
   * Stores a new Display.
   *
   * @param {String} name
   * @param {Boolean} active
   * @param {String} clientId
   * @param {String} description
   * @param {String} location
   *
   * @return {Promise<Number>}
   */
  async createDisplay (name, active, clientId, description, location) {
    let conn
    try {
      conn = await this.connectionPool.getConnection()
      const result = await conn.query(`INSERT INTO ${this.tableName} (name, active, client_id, description, location) VALUES (?,?,?,?,?)`, [name, active, clientId, description, location])
      return result.insertId
    } catch (e) {
      if (e.errno === 1062) {
        throw new DuplicateEntryError(e.code)
      }

      throw new Error(e.code)
    } finally {
      if (conn) {
        conn.release()
      }
    }
  }

  /**
   * @param {Number} displayId The ID of the Display to delete
   *
   * @return {Promise<Number>|Promise<null>} Returns the ID if the Display existed before deletion, null otherwise
   */
  async deleteDisplay (displayId) {
    let conn
    try {
      conn = await this.connectionPool.getConnection()
      const result = await conn.query(`DELETE FROM ${this.tableName} WHERE id = ? LIMIT 1`, displayId)
      return (result.affectedRows === 1 ? displayId : null)
    } finally {
      if (conn) {
        conn.release()
      }
    }
  }

  transformDisplay (row) {
    return {
      id: row.id,
      name: row.name,
      active: row.active === 1,
      clientId: row.client_id || '',
      description: row.description,
      location: row.location
    }
  }

  async getAllDisplays () {
    let conn
    try {
      conn = await this.connectionPool.getConnection()
      const rows = await conn.query('SELECT * FROM ' + this.tableName)
      return rows.map(this.transformDisplay)
    } finally {
      if (conn) {
        conn.release()
      }
    }
  }

  /**
   * Finds and returns a Display object with a certain ID.
   *
   * @param {Number} displayId The ID of the Display
   *
   * @return {Promise}
   */
  async getDisplayById (displayId) {
    let conn
    try {
      conn = await this.connectionPool.getConnection()
      const rows = await conn.query(`SELECT * FROM ${this.tableName} WHERE id = ? LIMIT 1`, displayId)
      if (rows.length === 0) {
        return null
      }
      return this.transformDisplay(rows[0])
    } finally {
      if (conn) {
        conn.release()
      }
    }
  }

  /**
   * Finds and returns Display objects for a number of Display IDs.
   *
   * @param {Number[]} displayIds The IDs of the Displays
   *
   * @return {Promise<Object[]>}
   */
  async getDisplaysById (displayIds) {
    let conn
    try {
      conn = await this.connectionPool.getConnection()
      const rows = await conn.query('SELECT * FROM ' + this.tableName + ' WHERE id IN ?', [displayIds])
      return rows.map(this.transformDisplay)
    } finally {
      if (conn) {
        conn.release()
      }
    }
  }

  /**
   * @param {String} clientId
   *
   * @return {Promise<Object>|Promise<null>}
   */
  async getDisplayByClientId (clientId) {
    let conn
    try {
      conn = await this.connectionPool.getConnection()
      const rows = await conn.query(`SELECT * FROM ${this.tableName} WHERE client_id = ? LIMIT 1`, clientId)
      return rows.length === 1 ? this.transformDisplay(rows[0]) : null
    } finally {
      if (conn) {
        conn.release()
      }
    }
  }

  /**
   * Updates an existing Display.
   *
   * @param {Number} displayId
   * @param {String} name
   * @param {Boolean} active
   * @param {String} clientId
   * @param {String} description
   * @param {String} location
   *
   * @return {Promise<Number>|Promise<null>}
   */
  async updateDisplay (displayId, name, active, clientId, description, location) {
    let conn
    try {
      conn = await this.connectionPool.getConnection()
      const activeValue = active === true ? 1 : 0
      const result = await conn.query(
        `UPDATE ${this.tableName} SET name = ?, active = ?, client_id = ?, description = ?, location = ? WHERE id = ?`,
        [name, activeValue, clientId, description, location, displayId]
      )
      return result.affectedRows === 1 ? displayId : null
    } finally {
      if (conn) {
        conn.release()
      }
    }
  }
}

module.exports = DisplayRepository
