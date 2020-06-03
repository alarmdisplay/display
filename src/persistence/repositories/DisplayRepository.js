const Repository = require('./Repository')

class DisplayRepository extends Repository {
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
    const activeValue = active === true ? 1 : 0
    return this.database.insert(this.tableName, { name, active: activeValue, client_id: clientId, description, location })
  }

  rowToObject (row) {
    return {
      id: row.id,
      name: row.name,
      active: row.active === 1,
      clientId: row.client_id || '',
      description: row.description,
      location: row.location
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
    const rows = await this.database.select(this.tableName, '*', { id: displayId }, {}, 1)
    return rows.length === 1 ? this.rowToObject(rows[0]) : null
  }

  /**
   * Finds and returns Display objects for a number of Display IDs.
   *
   * @param {Number[]} displayIds The IDs of the Displays
   *
   * @return {Promise<Object[]>}
   */
  async getDisplaysById (displayIds) {
    const rows = await this.database.select(this.tableName, '*', { id: displayIds })
    return rows.map(this.rowToObject)
  }

  /**
   * @param {String} clientId
   *
   * @return {Promise<Object>|Promise<null>}
   */
  async getDisplayByClientId (clientId) {
    const rows = await this.database.select(this.tableName, '*', { client_id: clientId }, {}, 1)
    return rows.length === 1 ? this.rowToObject(rows[0]) : null
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
    const activeValue = active === true ? 1 : 0
    const values = { name, active: activeValue, client_id: clientId, description, location }
    const affectedRows = await this.database.update(this.tableName, values, { id: displayId })
    return affectedRows === 1 ? displayId : null
  }
}

module.exports = DisplayRepository
