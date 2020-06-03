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
   * @param {Date} time
   * @param {String} location
   * @param {String} status
   * @param {String} category
   * @param {String} contact
   *
   * @return {Promise<Object>}
   */
  async createAlert (title, keyword, description, time, location, status, category, contact) {
    const alertTime = time || new Date()
    const minutesActive = status === 'Test' ? 1 : 60
    const alertId = await this.alertRepository.create(
      title || 'Einsatz',
      keyword || '',
      description || '',
      alertTime,
      location || '',
      status || 'Actual',
      category || 'Other',
      contact || '',
      new Date(alertTime.valueOf() + 60 * minutesActive * 1000)
    )
    const alert = await this.alertRepository.getOne(alertId)
    this.emit('alert_created', alert)
    return alert
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
   * @return {Promise<Object>|Promise<null>}
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
