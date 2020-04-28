const NotFoundError = require('../errors/NotFoundError')

class ComponentOptionRepository {
  constructor () {
    this.options = new Map()
  }

  /**
   * @param {Number} componentId
   * @param {String} key
   * @param {String} value
   *
   * @return {Promise<Object>}
   */
  createOption (componentId, key, value) {
    return new Promise((resolve, reject) => {
      if (!this.options.has(componentId)) {
        this.options.set(componentId, new Map())
      }

      const componentOptions = this.options.get(componentId)
      if (componentOptions.has(key)) {
        reject(new Error(`Component ${componentId} already has an option for key ${key}`))
        return
      }
      componentOptions.set(key, value)
      resolve({
        componentId: componentId,
        key: key,
        value: value
      })
    })
  }

  /**
   * @param {Number} componentId
   * @param {String} key
   *
   * @return {Promise<String>}
   */
  getOption (componentId, key) {
    return new Promise((resolve, reject) => {
      if (!this.options.has(componentId)) {
        reject(new NotFoundError(`There is no Component with ID ${componentId}`))
        return
      }

      const componentOptions = this.options.get(componentId)
      if (!componentOptions.has(key)) {
        reject(new NotFoundError(`There is no option for Component ${componentId} and key ${key}`))
        return
      }
      resolve(String(componentOptions.get(key)))
    })
  }

  /**
   * @param componentId
   * @return {Promise<Map<String,String>>}
   */
  getOptionsForComponent (componentId) {
    return new Promise(resolve => {
      if (!this.options.has(componentId)) {
        resolve(new Map())
        return
      }

      const componentOptions = this.options.get(componentId)
      const allOptions = new Map()
      for (const [key, value] of componentOptions.entries()) {
        allOptions.set(key, value)
      }
      resolve(allOptions)
    })
  }

  /**
   * @param {Number} componentId
   * @param {String} key
   * @param {String} value
   *
   * @return {Promise<String>} The updated value
   */
  updateOption (componentId, key, value) {
    return new Promise((resolve, reject) => {
      if (!this.options.has(componentId)) {
        reject(new NotFoundError(`There is no Component with ID ${componentId}`))
        return
      }

      const componentOptions = this.options.get(componentId)
      if (!componentOptions.has(key)) {
        reject(new NotFoundError(`There is no option for Component ${componentId} and key ${key}`))
        return
      }

      componentOptions.set(key, value)
      resolve(String(componentOptions.get(key)))
    })
  }

  /**
   * @param {Number} componentId
   * @param {String} key
   *
   * @return {Promise}
   */
  deleteOption (componentId, key) {
    return new Promise(resolve => {
      if (!this.options.has(componentId)) {
        resolve()
        return
      }

      const componentOptions = this.options.get(componentId)
      componentOptions.delete(key)
      resolve()
    })
  }
}

module.exports = ComponentOptionRepository
