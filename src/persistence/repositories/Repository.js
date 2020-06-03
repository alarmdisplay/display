class Repository {
  /**
   * @param {Database} database The Database instance to use for queries
   * @param {String} tableName The name of the database table, including the optional prefix
   */
  constructor (database, tableName) {
    this.database = database
    this.tableName = tableName
  }

  /**
   * @param {Number} id The ID of the item to delete
   *
   * @return {Promise<Number>|Promise<null>} Returns the ID if the item existed before deletion, null otherwise
   */
  async deleteOne (id) {
    const affectedRows = await this.database.delete(this.tableName, { id }, 1)
    return (affectedRows === 1 ? id : null)
  }

  /**
   * Returns all items.
   *
   * @return {Promise<Object[]>}
   */
  async getAll () {
    const rows = await this.database.select(this.tableName)
    return rows.map(this.rowToObject)
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
