const EventEmitter = require('events')

const IllegalArgumentError = require('../errors/IllegalArgumentError')

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

  /**
   * Creates a new View for a Display and appends it as the last View for that screen type.
   *
   * @param {String} name
   * @param {Number} columns
   * @param {Number} rows
   * @param {Number} displayId
   * @param {String} screenType
   *
   * @return {Promise}
   */
  createView (name, columns, rows, displayId, screenType) {
    return this.viewRepository.getViewsByDisplayIdAndScreenType(displayId, screenType)
      .then(views => {
        return this.viewRepository.createView(name, columns, rows, displayId, views.length + 1, screenType)
      })
  }

  getViewsForDisplay (displayId) {
    return this.viewRepository.getViewsByDisplayId(displayId)
  }

  /**
   * @param {Number} viewId
   * @return {Promise}
   */
  getView (viewId) {
    // TODO include components
    return this.viewRepository.getViewById(viewId)
  }
}

module.exports = DisplayService
