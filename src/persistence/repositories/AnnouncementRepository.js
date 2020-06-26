const Repository = require('./Repository')

class AnnouncementRepository extends Repository {
  /**
   * @param {String} title
   * @param {String} body
   * @param {Boolean} important
   * @param {Date} validFrom
   * @param {Date} validTo
   */
  async create (title, body, important, validFrom, validTo) {
    const importantValue = important === true ? 1 : 0
    return this.database.insert(this.tableName, { title, body, important: importantValue, valid_from: validFrom, valid_to: validTo })
  }

  /**
   * @param {Number} id
   *
   * @return {Promise<Object>|Promise<null>}
   */
  async getOne (id) {
    const rows = await this.database.select(this.tableName, '*', { id }, {}, 1)
    if (rows.length === 0) {
      return null
    }
    return this.rowToObject(rows[0])
  }

  rowToObject (row) {
    return {
      id: row.id,
      title: row.title || '',
      text: row.body || '',
      important: row.important === 1,
      validFrom: row.valid_from,
      validTo: row.valid_to,
      createdAt: row.created,
      updatedAt: row.updated
    }
  }

  /**
   * @param {Number} id
   * @param {String} title
   * @param {String} body
   * @param {Boolean} important
   * @param {Date} validFrom
   * @param {Date} validTo
   *
   * @return {Promise<Object>|Promise<null>}
   */
  async updateOne (id, title, body, important, validFrom, validTo) {
    const importantValue = important === true ? 1 : 0
    const affectedRows = await this.database.update(
      this.tableName,
      { title, body, important: importantValue, valid_from: validFrom, valid_to: validTo },
      { id }
    )
    return affectedRows === 1 ? id : null
  }
}

module.exports = AnnouncementRepository
