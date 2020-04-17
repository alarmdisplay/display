const EventEmitter = require('events')

class DisplayService extends EventEmitter {
  /**
   * @param {DisplayRepository} displayRepository
   * @param {ViewRepository} viewRepository
   */
  constructor (displayRepository, viewRepository) {
    super()
    this.displayRepository = displayRepository
    this.viewRepository = viewRepository
  }

  createDisplay (name, active, clientId, description = '', location = '') {
    return this.displayRepository.createDisplay(name, active, clientId, description, location)
      .then(newDisplay => {
        this.emit('display_created', newDisplay)
        return newDisplay
      })
  }

  getAllDisplays () {
    return this.displayRepository.getAllDisplays()
  }

  getDisplayById (displayId) {
    return this.displayRepository.getDisplayById(displayId)
  }

  getDisplayByClientId (clientId) {
    return this.displayRepository.getDisplayByClientId(clientId)
  }

  deleteDisplay (displayId) {
    return this.displayRepository.deleteDisplay(displayId)
      .then(displayId => {
        if (displayId) {
          this.emit('display_deleted', displayId)
        }

        return displayId
      })
  }

  updateDisplay (displayId, name, active, clientId, description, location) {
    return this.displayRepository.updateDisplay(displayId, name, active, clientId, description, location)
      .then(updatedDisplay => {
        this.emit('display_updated', updatedDisplay)
        return updatedDisplay
      })
  }

  getViewsForDisplay (displayId) {
    return this.viewRepository.getViewsByDisplayId(displayId)
  }
}

module.exports = DisplayService
