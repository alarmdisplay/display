const DuplicateEntryError = require('../../errors/DuplicateEntryError')
const Repository = require('./Repository')

class ContentSlotRepository extends Repository {
  /**
   * @param connectionPool
   * @param {String} prefix The prefix used for the database tables
   */
  constructor (connectionPool, prefix) {
    super(connectionPool)
    this.tableName = `${prefix}contentslots`
  }

  /**
   * @param {String} componentType
   * @param {Number} viewId
   * @param {Number} columnStart
   * @param {Number} rowStart
   * @param {Number} columnEnd
   * @param {Number} rowEnd
   *
   * @return {Promise<Number>}
   */
  async createContentSlot (componentType, viewId, columnStart, rowStart, columnEnd, rowEnd) {
    let conn
    try {
      conn = await this.connectionPool.getConnection()
      const result = await conn.query(
        `INSERT INTO ${this.tableName} (\`view_id\`, \`component_type\`, \`column_start\`, \`row_start\`, \`column_end\`, \`row_end\`) VALUES (?,?,?,?,?,?)`,
        [viewId, componentType, columnStart, rowStart, columnEnd, rowEnd]
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
   * @param {Number} id
   *
   * @return {Promise<Object>|Promise<null>}
   */
  async getContentSlot (id) {
    let conn
    try {
      conn = await this.connectionPool.getConnection()
      const rows = await conn.query(`SELECT * FROM ${this.tableName} WHERE id = ? LIMIT 1`, id)
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

  /**
   * Finds and returns Content Slot objects that belong to a certain View.
   *
   * @param {Number} viewId The ID of the View
   *
   * @return {Promise<Object[]>}
   */
  async getContentSlotsByViewId (viewId) {
    let conn
    try {
      conn = await this.connectionPool.getConnection()
      const rows = await conn.query(`SELECT * FROM ${this.tableName} WHERE view_id = ?`, viewId)
      return rows.map(this.rowToObject)
    } finally {
      if (conn) {
        conn.release()
      }
    }
  }

  /**
   * Finds and returns Content Slot objects that contain a certain type of Component.
   *
   * @param {String} componentType The type of the Component that should be displayed in this Content Slot
   *
   * @return {Promise<Object[]>}
   */
  async getContentSlotsByComponentType (componentType) {
    let conn
    try {
      conn = await this.connectionPool.getConnection()
      const rows = await conn.query(`SELECT * FROM ${this.tableName} WHERE component_type = ?`, componentType)
      return rows.map(this.rowToObject)
    } finally {
      if (conn) {
        conn.release()
      }
    }
  }

  /**
   * @param row
   * @return {{componentType: String, columnEnd: Number, viewId: Number, columnStart: Number, rowStart: Number, rowEnd: Number, id: Number}}
   */
  rowToObject (row) {
    return {
      id: row.id,
      componentType: row.component_type,
      viewId: row.view_id,
      columnStart: row.column_start,
      rowStart: row.row_start,
      columnEnd: row.column_end,
      rowEnd: row.row_end
    }
  }

  /**
   * @param {Number} id
   * @param {String} componentType
   * @param {Number} viewId
   * @param {Number} columnStart
   * @param {Number} rowStart
   * @param {Number} columnEnd
   * @param {Number} rowEnd
   *
   * @return {Promise<Number>|Promise<null>}
   */
  async updateContentSlot (id, componentType, viewId, columnStart, rowStart, columnEnd, rowEnd) {
    let conn
    try {
      conn = await this.connectionPool.getConnection()
      const result = await conn.query(
        `UPDATE ${this.tableName} SET \`view_id\` = ?, \`component_type\` = ?, \`column_start\` = ?, \`row_start\` = ?, \`column_end\` = ?, \`row_end\` = ? WHERE \`id\` = ?`,
        [viewId, componentType, columnStart, rowStart, columnEnd, rowEnd, id]
      )
      return result.affectedRows === 1 ? id : null
    } finally {
      if (conn) {
        conn.release()
      }
    }
  }
}

module.exports = ContentSlotRepository
