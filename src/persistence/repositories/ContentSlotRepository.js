const Repository = require('./Repository')

class ContentSlotRepository extends Repository {
  /**
   * @param {Database} database The Database instance to use for queries
   * @param {String} tableName The name of the database table, including the optional prefix
   * @param {String} optionsTableName
   */
  constructor (database, tableName, optionsTableName) {
    super(database, tableName)
    this.optionsTableName = optionsTableName
  }

  /**
   * @param {String} componentType
   * @param {Number} viewId
   * @param {Number} columnStart
   * @param {Number} rowStart
   * @param {Number} columnEnd
   * @param {Number} rowEnd
   * @param {Object} options
   *
   * @return {Promise<Number>}
   */
  async createContentSlot (componentType, viewId, columnStart, rowStart, columnEnd, rowEnd, options) {
    const contentSlotId = await this.database.insert(this.tableName, {
      view_id: viewId,
      component_type: componentType,
      column_start: columnStart,
      row_start: rowStart,
      column_end: columnEnd,
      row_end: rowEnd
    })
    await this.setOptionsForContentSlot(contentSlotId, options)
    return contentSlotId
  }

  /**
   * Finds and returns Content Slot objects that belong to a certain View.
   *
   * @param {Number} viewId The ID of the View
   *
   * @return {Promise<Object[]>}
   */
  async getContentSlotsByViewId (viewId) {
    const rows = await this.database.select(this.tableName, '*', { view_id: viewId })

    if (rows.length === 0) {
      return []
    }

    // Get options for all found content slots
    const contentSlotIds = rows.map(row => row.id)
    const options = await this.getOptionsForContentSlots(contentSlotIds)
    return rows.map(row => {
      // Combine each content slot row with the option rows belonging to that content slot
      return this.rowToObjectWithOptions(row, options.get(row.id))
    })
  }

  /**
   * Finds and returns Content Slot objects that contain a certain type of Component.
   *
   * @param {String} componentType The type of the Component that should be displayed in this Content Slot
   *
   * @return {Promise<Object[]>}
   */
  async getContentSlotsByComponentType (componentType) {
    const rows = await this.database.select(this.tableName, '*', { component_type: componentType })
    return rows.map(this.rowToObject)
  }

  /**
   * @param id
   *
   * @return {Promise<Map<String,String>>}
   */
  async getOptionsForContentSlot (id) {
    const rows = await this.database.select(this.optionsTableName, '*', { contentslot_id: id })
    const options = new Map()
    rows.forEach(row => {
      options.set(row.name, row.value)
    })
    return options
  }

  /**
   * @param ids
   *
   * @return {Promise<Map<Number,Map<String,String>>>} A Map of Maps, keyed by component ID, then by option name
   */
  async getOptionsForContentSlots (ids) {
    const rows = await this.database.select(this.optionsTableName, '*', { contentslot_id: ids })

    // Initialize the Map with a Map for each content slot
    const options = new Map()
    ids.forEach(id => {
      options.set(id, new Map())
    })

    // Fill the Maps
    rows.forEach(({ contentslot_id: id, name, value }) => {
      options.get(id).set(name, value)
    })
    return options
  }

  /**
   * @param {Number} id The ID of the content slot
   * @param {Object} options
   *
   * @return {Promise<Boolean>}
   */
  async setOptionsForContentSlot (id, options) {
    let optionsChanged = false
    const existingOptions = await this.getOptionsForContentSlot(id)
    // Remove existing options not present in the new options object
    for (const key of existingOptions.keys()) {
      if (!Object.prototype.hasOwnProperty.call(options, key)) {
        await this.database.delete(this.optionsTableName, { contentslot_id: id, name: key })
        optionsChanged = true
      }
    }

    for (const [key, value] of Object.entries(options)) {
      if (existingOptions.has(key)) {
        const affectedRows = await this.database.update(this.optionsTableName, { value }, { contentslot_id: id, name: key })
        if (affectedRows === 1) {
          optionsChanged = true
        }
        continue
      }

      await this.database.insert(this.optionsTableName, { contentslot_id: id, name: key, value })
      optionsChanged = true
    }

    return optionsChanged
  }

  /**
   * @param {Object} row
   *
   * @return {{componentType: String, columnEnd: Number, viewId: Number, columnStart: Number, rowStart: Number, rowEnd: Number, id: Number, options: Object}}
   */
  rowToObject (row) {
    return {
      id: row.id,
      componentType: row.component_type,
      viewId: row.view_id,
      columnStart: row.column_start,
      rowStart: row.row_start,
      columnEnd: row.column_end,
      rowEnd: row.row_end,
      options: {}
    }
  }

  /**
   * @param {Object} row
   * @param {Map<String,String>} options
   *
   * @return {{componentType: String, columnEnd: Number, viewId: Number, columnStart: Number, rowStart: Number, rowEnd: Number, id: Number, options: Object}}
   */
  rowToObjectWithOptions (row, options) {
    const object = this.rowToObject(row)
    options.forEach((value, key) => {
      object.options[key] = value
    })
    return object
  }

  /**
   * @param {Number} id
   * @param {String} componentType
   * @param {Number} viewId
   * @param {Number} columnStart
   * @param {Number} rowStart
   * @param {Number} columnEnd
   * @param {Number} rowEnd
   * @param {Object} options
   *
   * @return {Promise<Number>|Promise<null>}
   */
  async updateContentSlot (id, componentType, viewId, columnStart, rowStart, columnEnd, rowEnd, options) {
    const affectedRows = await this.database.update(this.tableName, {
      view_id: viewId,
      component_type: componentType,
      column_start: columnStart,
      row_start: rowStart,
      column_end: columnEnd,
      row_end: rowEnd
    }, { id })
    const contentSlotChanged = affectedRows === 1
    const optionsChanged = await this.setOptionsForContentSlot(id, options)
    const result = contentSlotChanged || optionsChanged
    return result === true ? id : null
  }
}

module.exports = ContentSlotRepository
