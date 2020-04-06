class DisplayRepository {
  constructor () {
    this.displays = new Map()
    this.idCounter = 1
  }

  /**
   * Stores a new Display.
   *
   * @param {String} name
   * @param {Boolean} active
   * @param {String} clientId
   * @param {String} description
   * @param {String} location
   * @return {Promise}
   */
  createDisplay (name, active, clientId, description = '', location = '') {
    return new Promise((resolve) => {
      const display = {
        id: this.idCounter++,
        name: name,
        active: active,
        clientId: clientId,
        description: description,
        location: location
      }

      this.displays.set(display.id, display)
      resolve(display)
    })
  }

  deleteDisplay (displayId) {
    return new Promise((resolve) => {
      const elementExisted = this.displays.delete(displayId)
      resolve(elementExisted ? displayId : undefined)
    })
  }

  getAllDisplays () {
    return new Promise(resolve => {
      const displays = Array.from(this.displays.values())
      resolve(displays)
    })
  }

  /**
   * Finds and returns a Display object with a certain ID.
   *
   * @param {Number} displayId The ID of the Display
   *
   * @return {Promise}
   */
  getDisplayById (displayId) {
    return new Promise((resolve, reject) => {
      if (!this.displays.has(displayId)) {
        return reject(new Error(`No Display with ID ${displayId} found`))
      }

      resolve(this.displays.get(displayId))
    })
  }

  /**
   * Updates an existing Display.
   *
   * @param {Number} displayId
   * @param {String} name
   * @param {Boolean} active
   * @param {String} clientId
   * @param {String} description
   * @param {String} location
   * @return {Promise}
   */
  updateDisplay (displayId, name, active, clientId, description = '', location = '') {
    return new Promise((resolve, reject) => {
      if (!this.displays.has(displayId)) {
        return reject(new Error(`No Display with ID ${displayId} found`))
      }

      const display = {
        id: displayId,
        name: name,
        active: active,
        clientId: clientId,
        description: description,
        location: location
      }
      this.displays.set(displayId, display)
      resolve(display)
    })
  }
}

module.exports = DisplayRepository
