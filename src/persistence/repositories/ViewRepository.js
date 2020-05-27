const DuplicateEntryError = require('../../errors/DuplicateEntryError')

class ViewRepository {
  /**
   * @param connectionPool
   * @param {String} prefix The prefix used for the database tables
   */
  constructor (connectionPool, prefix) {
    this.connectionPool = connectionPool
    this.tableName = `${prefix}views`
  }

  /**
   * Stores a new View object.
   *
   * @param {Number} displayId The ID of the Display that uses this View
   * @param {Number} order A number that defines the order of Views per screenType of a Display
   * @param {String} screenType An identifier for the type of screen the View is used for (e.g. IdleScreen)
   * @param {Number} columns The number of columns the View's layout should have
   * @param {Number} rows The number of rows the View's layout should have
   *
   * @return {Promise}
   */
  async create (displayId, order, screenType, columns, rows) {
    let conn
    try {
      conn = await this.connectionPool.getConnection()
      const result = await conn.query(
        `INSERT INTO ${this.tableName} (\`display_id\`, \`view_order\`, \`screen_type\`, \`columns\`, \`rows\`) VALUES (?,?,?,?,?)`,
        [displayId, order, screenType, columns, rows]
      )
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
   * Finds and returns a View object with a certain ID.
   *
   * @param {Number} id The ID of the View
   *
   * @return {Promise<Object>|Promise<null>}
   */
  async getViewById (id) {
    let conn
    try {
      conn = await this.connectionPool.getConnection()
      const rows = await conn.query(`SELECT * FROM ${this.tableName} WHERE id = ? LIMIT 1`, id)
      if (rows.length === 0) {
        return null
      }
      return this.transformView(rows[0])
    } finally {
      if (conn) {
        conn.release()
      }
    }
  }

  /**
   * Finds and returns View objects for a number of View IDs.
   *
   * @param {Number[]} viewIds The IDs of the Views
   *
   * @return {Promise<Object[]>}
   */
  async getViewsById (viewIds) {
    let conn
    try {
      conn = await this.connectionPool.getConnection()
      const rows = await conn.query('SELECT * FROM ' + this.tableName + ' WHERE id IN ?', [viewIds])
      return rows.map(this.transformView)
    } finally {
      if (conn) {
        conn.release()
      }
    }
  }

  /**
   * Finds and returns View objects for a certain Display.
   *
   * @param {Number} displayId The ID of the Display
   *
   * @return {Promise<Object[]>}
   */
  async getViewsByDisplayId (displayId) {
    let conn
    try {
      conn = await this.connectionPool.getConnection()
      const rows = await conn.query(`SELECT * FROM ${this.tableName} WHERE display_id = ? ORDER BY view_order`, displayId)
      return rows.map(this.transformView)
    } finally {
      if (conn) {
        conn.release()
      }
    }
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
    let conn
    try {
      conn = await this.connectionPool.getConnection()
      const rows = await conn.query(`SELECT * FROM ${this.tableName} WHERE display_id = ? AND screen_type = ? ORDER BY view_order`, [displayId, screenType])
      return rows.map(this.transformView)
    } finally {
      if (conn) {
        conn.release()
      }
    }
  }

  /**
   * Deletes a View object.
   *
   * @param {Number} id The ID of the View
   *
   * @return {Promise}
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
   * Updates an existing View object.
   *
   * @param {Number} id A unique ID
   * @param {Number} displayId The ID of the Display that uses this View
   * @param {Number} order A number that defines the order of Views per screenType of a Display
   * @param {String} screenType An identifier for the type of screen the View is used for (e.g. IdleScreen)
   * @param {Number} columns The number of columns the View's layout should have
   * @param {Number} rows The number of rows the View's layout should have
   *
   * @return {Promise<Object>}
   */
  async update (id, displayId, order, screenType, columns, rows) {
    let conn
    try {
      conn = await this.connectionPool.getConnection()
      const result = await conn.query(
        `UPDATE ${this.tableName} SET \`display_id\` = ?, \`view_order\` = ?, \`screen_type\` = ?, \`columns\` = ?, \`rows\` = ? WHERE \`id\` = ?`,
        [displayId, order, screenType, columns, rows, id]
      )
      return result.affectedRows === 1 ? id : null
    } finally {
      if (conn) {
        conn.release()
      }
    }
  }

  transformView (row) {
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
