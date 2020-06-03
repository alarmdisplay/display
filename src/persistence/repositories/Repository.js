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
