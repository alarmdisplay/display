const Repository = require('./Repository')

class ViewRepository extends Repository {
  /**
   * Stores a new View object.
   *
   * @param {Number} displayId The ID of the Display that uses this View
   * @param {Number} order A number that defines the order of Views per screenType of a Display
   * @param {String} screenType An identifier for the type of screen the View is used for (e.g. IdleScreen)
   * @param {Number} columns The number of columns the View's layout should have
   * @param {Number} rows The number of rows the View's layout should have
   *
   * @return {Promise<Number>}
   */
  async create (displayId, order, screenType, columns, rows) {
    return this.database.insert(this.tableName, { display_id: displayId, view_order: order, screen_type: screenType, columns, rows })
  }

  /**
   * Finds and returns a View object with a certain ID.
   *
   * @param {Number} id The ID of the View
   *
   * @return {Promise<Object>|Promise<null>}
   */
  async getViewById (id) {
    const rows = await this.database.select(this.tableName, '*', { id }, {}, 1)
    if (rows.length === 0) {
      return null
    }
    return this.rowToObject(rows[0])
  }

  /**
   * Finds and returns View objects for a number of View IDs.
   *
   * @param {Number[]} viewIds The IDs of the Views
   *
   * @return {Promise<Object[]>}
   */
  async getViewsById (viewIds) {
    const rows = await this.database.select(this.tableName, '*', { id: viewIds })
    return rows.map(this.rowToObject)
  }

  /**
   * Finds and returns View objects for a certain Display.
   *
   * @param {Number} displayId The ID of the Display
   *
   * @return {Promise<Object[]>}
   */
  async getViewsByDisplayId (displayId) {
    const rows = await this.database.select(this.tableName, '*', { display_id: displayId }, { view_order: 1 })
    return rows.map(this.rowToObject)
  }

  /**
   * Finds and returns View objects for a certain Display and of a certain screen type.
   *
   * @param {Number} displayId The ID of the Display
   * @param {String} screenType An identifier for the type of screen the View is used for (e.g. IdleScreen)
   *
   * @return {Promise}
   */
  async getViewsByDisplayIdAndScreenType (displayId, screenType) {
    const rows = await this.database.select(this.tableName, '*', { display_id: displayId, screen_type: screenType }, { view_order: 1 })
    return rows.map(this.rowToObject)
  }

  /**
   * Updates an existing View object.
   *
   * @param {Number} id A unique ID
   * @param {Number} displayId The ID of the Display that uses this View
   * @param {Number} order A number that defines the order of Views per screenType of a Display
   * @param {String} screenType An identifier for the type of screen the View is used for (e.g. IdleScreen)
   * @param {Number} columns The number of columns the View's layout should have
   * @param {Number} rows The number of rows the View's layout should have
   *
   * @return {Promise<Number>|Promise<null>}
   */
  async update (id, displayId, order, screenType, columns, rows) {
    const affectedRows = await this.database.update(
      this.tableName,
      { display_id: displayId, view_order: order, screen_type: screenType, columns, rows },
      { id }
    )
    return affectedRows === 1 ? id : null
  }

  rowToObject (row) {
    return {
      id: row.id,
      displayId: row.display_id,
      order: row.view_order,
      screenType: row.screen_type,
      columns: row.columns,
      rows: row.rows
    }
  }
}

module.exports = ViewRepository
