const Repository = require('./Repository')

class AlertRepository extends Repository {
  /**
   * @param {String} title
   * @param {String} keyword
   * @param {String} description
   * @param {Date} time
   * @param {String} location
   * @param {String} status
   * @param {String} category
   * @param {String} contact
   * @param {Date} expires
   *
   * @return {Promise<Number>}
   */
  async create (title, keyword, description, time, location, status, category, contact, expires) {
    return this.database.insert(this.tableName, { title, keyword, description, time, location, status, category, contact, expires })
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
      title: row.title,
      keyword: row.keyword,
      description: row.description,
      time: row.time,
      location: row.location,
      status: row.status,
      category: row.category,
      contact: row.contact,
      expires: row.expires,
      updatedAt: row.updated
    }
  }
}

module.exports = AlertRepository
