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
      const components = []
      this.components.forEach(storedComponent => {
        // Clone each component, so each recipient modifies their own copy
        const component = {}
        for (const prop of Object.getOwnPropertyNames(storedComponent)) {
          component[prop] = storedComponent[prop]
        }
        components.push(component)
      })
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

      // Clone the component, so each recipient modifies their own copy
      const component = {}
      const storedComponent = this.components.get(id)
      for (const prop of Object.getOwnPropertyNames(storedComponent)) {
        component[prop] = storedComponent[prop]
      }
      resolve(component)
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
   * @param {String} componentType
   *
   * @return {Promise<Object[]>}
   */
  getComponentsForComponentType (componentType) {
    return new Promise((resolve) => {
      const components = []

      this.components.forEach(storedComponent => {
        if (storedComponent.type === componentType) {
          // Clone the component, so each recipient modifies their own copy
          const component = {}
          for (const prop of Object.getOwnPropertyNames(storedComponent)) {
            component[prop] = storedComponent[prop]
          }
          components.push(component)
        }
      })

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
