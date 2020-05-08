const EventEmitter = require('events')

class AlertService extends EventEmitter {
  /**
   * @param {AlertRepository} alertRepository
   */
  constructor (alertRepository) {
    super()
    this.alertRepository = alertRepository
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
   *
   * @return {Promise<Object>}
   */
  createAlert (title, keyword, description, time, location, status, category, contact) {
    return this.alertRepository.create(title, keyword, description, time, location, status, category, contact)
      .then(alert => {
        this.emit('alert_created', alert)
        return alert
      })
  }

  /**
   * @return {Promise<Object[]>}
   */
  getAllAlerts () {
    return this.alertRepository.getAll()
  }

  /**
   * @param {Number} alertId The ID of the Alert to get
   *
   * @return {Promise<Object>}
   */
  getAlert (alertId) {
    return this.alertRepository.getOne(alertId)
  }

  /**
   * @param {Number} alertId The ID of the Alert to delete
   *
   * @return {Promise}
   */
  removeAlert (alertId) {
    return this.alertRepository.deleteOne(alertId)
      .then(() => {
        this.emit('alert_removed', alertId)
        return alertId
      })
  }
}

module.exports = AlertService
