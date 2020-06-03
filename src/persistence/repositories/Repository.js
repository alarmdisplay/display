class Repository {
  constructor (connectionPool) {
    this.connectionPool = connectionPool
    this.tableName = '' // Has to be set in a child class
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
