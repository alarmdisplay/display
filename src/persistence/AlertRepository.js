const NotFoundError = require('../errors/NotFoundError')

class AlertRepository {
  constructor () {
    this.alerts = new Map()
    this.instanceCounter = 1
  }

  /**
   * @param {String} title
   * @param {String} keyword
   * @param {String} description
   * @param {Number} time
   * @param {String} location
   * @param {String} status
   * @param {String} category
   * @param {String} contact
   */
  create (title, keyword, description, time, location, status, category, contact) {
    return new Promise(resolve => {
      const newAlert = {
        id: this.instanceCounter++,
        title: title,
        keyword: keyword,
        description: description,
        time: time,
        location: location,
        status: status,
        category: category,
        contact: contact,
        updatedAt: Math.floor(Date.now() / 1000)
      }
      this.alerts.set(newAlert.id, newAlert)
      resolve(newAlert)
    })
  }

  /**
   * @return {Promise<Object[]>}
   */
  getAll () {
    return new Promise(resolve => {
      const alerts = []
      this.alerts.forEach(storedAlert => {
        // Clone each Alert, so each recipient modifies their own copy
        const alert = {}
        for (const prop of Object.getOwnPropertyNames(storedAlert)) {
          alert[prop] = storedAlert[prop]
        }
        alerts.push(alert)
      })
      resolve(alerts)
    })
  }

  /**
   * @param {Number} id
   *
   * @return {Promise<Object>}
   */
  getOne (id) {
    return new Promise((resolve, reject) => {
      if (!this.alerts.has(id)) {
        return reject(new NotFoundError(`No Alert with ID ${id} found`))
      }

      // Clone the Alert, so each recipient modifies their own copy
      const alert = {}
      const storedAlert = this.alerts.get(id)
      for (const prop of Object.getOwnPropertyNames(storedAlert)) {
        alert[prop] = storedAlert[prop]
      }
      resolve(alert)
    })
  }

  /**
   * @param {Number} id
   *
   * @return {Promise}
   */
  deleteOne (id) {
    return new Promise(resolve => {
      const itemDidExist = this.alerts.delete(id)
      if (itemDidExist) {
        resolve(id)
      } else {
        resolve(undefined)
      }
    })
  }

  /**
   * @param {Number} id
   * @param {String} title
   * @param {String} keyword
   * @param {String} description
   * @param {Number} time
   * @param {String} location
   * @param {String} status
   * @param {String} category
   * @param {String} contact
   *
   * @return {Promise<Object>}
   */
  updateOne (id, title, keyword, description, time, location, status, category, contact) {
    return this.getOne(id)
      .then(alert => {
        const updatedAlert = {
          id: alert.id,
          title: title,
          keyword: keyword,
          description: description,
          time: time,
          location: location,
          status: status,
          category: category,
          contact: contact,
          updatedAt: Math.floor(Date.now() / 1000)
        }
        this.alerts.set(id, updatedAlert)
        return updatedAlert
      })
  }
}

module.exports = AlertRepository
