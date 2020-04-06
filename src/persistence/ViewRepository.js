class ViewRepository {
  constructor () {
    this.views = new Map()
  }

  /**
   * Stores a new View object.
   *
   * @param {Number} id A unique ID
   * @param {String} name A human-readable name for this View
   * @param {Number} columns The number of columns the View's layout should have
   * @param {Number} rows The number of rows the View's layout should have
   * @param {Number} displayId The ID of the Display that uses this View
   * @param {Number} order A number that defines the order of Views per screenType of a Display
   * @param {String} screenType An identifier for the type of screen the View is used for (e.g. IdleScreen)
   *
   * @return {Promise}
   */
  createView (id, name, columns, rows, displayId, order, screenType) {
    return new Promise((resolve, reject) => {
      if (this.views.has(id)) {
        return reject(new Error(`View with ID ${id} already exists`))
      }

      const view = {
        id: id,
        name: name,
        columns: columns,
        rows: rows,
        displayId: displayId,
        order: order,
        screenType: screenType
      }
      this.views.set(id, view)
      resolve(view)
    })
  }

  getAllViews () {
    return new Promise(resolve => {
      const views = Array.from(this.views.values())
      resolve(views)
    })
  }

  /**
   * Finds and returns a View object with a certain ID.
   *
   * @param {Number} id The ID of the View
   *
   * @return {Promise}
   */
  getViewById (id) {
    return new Promise((resolve, reject) => {
      if (!this.views.has(id)) {
        return reject(new Error(`No View with ID ${id} found`))
      }

      resolve(this.views.get(id))
    })
  }

  /**
   * Finds and returns a View object with a certain Display ID.
   *
   * @param {Number} displayId The ID of the Display
   *
   * @return {Promise}
   */
  getViewsByDisplayId (displayId) {
    return new Promise((resolve) => {
      const views = []
      for (const view of this.views.values()) {
        if (view.displayId === displayId) {
          views.push(view)
        }
      }

      // Sort the views by order property
      views.sort((a, b) => {
        return a.order - b.order
      })

      resolve(views)
    })
  }

  /**
   * Deletes a View object.
   *
   * @param {Number} id The ID of the View
   *
   * @return {Promise}
   */
  deleteView (id) {
    return new Promise(resolve => {
      this.views.delete(id)
      resolve()
    })
  }

  /**
   * Updates an existing View object.
   *
   * @param {Number} id A unique ID
   * @param {String} name A human-readable name for this View
   * @param {Number} columns The number of columns the View's layout should have
   * @param {Number} rows The number of rows the View's layout should have
   * @param {Number} displayId The ID of the Display that uses this View
   * @param {Number} order A number that defines the order of Views per screenType of a Display
   * @param {String} screenType An identifier for the type of screen the View is used for (e.g. IdleScreen)
   *
   * @return {Promise}
   */
  updateView (id, name, columns, rows, displayId, order, screenType) {
    return new Promise((resolve, reject) => {
      if (!this.views.has(id)) {
        return reject(new Error(`No View with ID ${id} found`))
      }

      const view = {
        id: id,
        name: name,
        columns: columns,
        rows: rows,
        displayId: displayId,
        order: order,
        screenType: screenType
      }
      this.views.set(id, view)
      resolve(view)
    })
  }
}

module.exports = ViewRepository
