class Repository {
  constructor (connectionPool) {
    this.connectionPool = connectionPool
    this.tableName = '' // Has to be set in a child class
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
   * Returns all items.
   *
   * @return {Promise<Object[]>}
   */
  async getAll () {
    let conn
    try {
      conn = await this.connectionPool.getConnection()
      const rows = await conn.query('SELECT * FROM ' + this.tableName)
      return rows.map(this.rowToObject)
    } finally {
      if (conn) {
        conn.release()
      }
    }
  }

  /**
   * Takes a database row and turns it into an Object to be used by the application. Default implementation,
   * override for custom logic.
   *
   * @param {Object} row
   *
   * @return {Object}
   */
  rowToObject (row) {
    return row
  }
}

module.exports = Repository
