const NotFoundError = require('../errors/NotFoundError')

class ComponentRepository {
  constructor () {
    this.components = new Map()
    this.instanceCounter = 1
  }

  /**
   * Stores a new Component object.
   *
   * @param {String} type
   * @param {String} name
   *
   * @return {Promise}
   */
  createComponent (type, name) {
    return new Promise((resolve, reject) => {
      const newComponent = {
        id: this.instanceCounter++,
        name: name,
        type: type
      }
      this.components.set(newComponent.id, newComponent)
      resolve(newComponent)
    })
  }

  /**
   * @return {Promise}
   */
  getAllComponents () {
    return new Promise(resolve => {
      const components = Array.from(this.components.values())
      resolve(components)
    })
  }

  /**
   * Get a single Component object.
   *
   * @param {Number} id The ID of the Component
   *
   * @return {Promise}
   */
  getComponent (id) {
    return new Promise((resolve, reject) => {
      if (!this.components.has(id)) {
        return reject(new NotFoundError(`No Component with ID ${id} found`))
      }

      resolve(this.components.get(id))
    })
  }

  /**
   * Get multiple Components at once.
   *
   * @param {Number[]} ids The IDs of the Components
   *
   * @return {Promise}
   */
  getComponents (ids) {
    return new Promise((resolve) => {
      const components = []

      for (const id of ids) {
        if (!this.components.has(id)) {
          continue
        }

        components.push(this.components.get(id))
      }

      resolve(components)
    })
  }

  /**
   * Deletes a single Component object.
   *
   * @param {Number} id
   *
   * @return {Promise}
   */
  deleteComponent (id) {
    return new Promise(resolve => {
      const itemDidExist = this.components.delete(id)
      if (itemDidExist) {
        resolve(id)
      } else {
        resolve(undefined)
      }
    })
  }

  /**
   * Updates a single Component object.
   *
   * @param {Number} id
   * @param {String} type
   * @param {String} name
   *
   * @return {Promise}
   */
  updateComponent (id, type, name) {
    return new Promise((resolve, reject) => {
      if (!this.components.has(id)) {
        return reject(new NotFoundError(`No Component with ID ${id} found`))
      }

      const component = {
        id: id,
        name: name,
        type: type
      }
      this.components.set(id, component)
      resolve(component)
    })
  }
}

module.exports = ComponentRepository
