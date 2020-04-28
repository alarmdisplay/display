const IllegalArgumentError = require('../errors/IllegalArgumentError')

const componentTypes = ['AnnouncementList', 'Clock', 'DWDWarningMap']

class ComponentService {
  /**
   * @param {ComponentRepository} componentRepository
   * @param {ComponentOptionRepository} componentOptionRepository
   */
  constructor (componentRepository, componentOptionRepository) {
    this.componentRepository = componentRepository
    this.componentOptionRepository = componentOptionRepository
  }

  createComponent (type, name, options = {}) {
    return new Promise((resolve, reject) => {
      if (!componentTypes.includes(type)) {
        reject(new IllegalArgumentError(`Component type '${type}' is unknown`))
        return
      }

      resolve(this.componentRepository.createComponent(type, name))
    })
      .then(component => this.setOptionsForComponent(component.id, options || {}))
  }

  /**
   * @param {Object} component
   * @param {Map<String, String>} allOptions
   *
   * @return {Object}
   */
  enrichComponentWithOptions (component, allOptions) {
    const options = {}
    for (const [key, value] of allOptions.entries()) {
      options[key] = value
    }
    component.options = options
    return component
  }

  getAllComponents () {
    return this.componentRepository.getAllComponents()
      .then(async components => {
        const enrichedComponents = []

        for (const component of components) {
          const options = await this.componentOptionRepository.getOptionsForComponent(component.id)
          enrichedComponents.push(this.enrichComponentWithOptions(component, options))
        }

        return enrichedComponents
      })
  }

  /**
   * @return {Promise<Map<Number, Object>>}
   */
  getAllComponentsAsMap () {
    return this.componentRepository.getAllComponents()
      .then(async components => {
        const map = new Map()
        for (const component of components) {
          component.options = await this.componentOptionRepository.getOptionsForComponent(component.id)
          map.set(component.id, component)
        }
        return map
      })
  }

  /**
   * @param {Number} id
   *
   * @return {Promise}
   */
  getComponent (id) {
    return Promise.all([this.componentRepository.getComponent(id), this.componentOptionRepository.getOptionsForComponent(id)])
      .then(([component, options]) => {
        return this.enrichComponentWithOptions(component, options)
      })
  }

  setOptionsForComponent (componentId, options = {}) {
    return this.componentOptionRepository.getOptionsForComponent(componentId)
      .then(async existingOptions => {
        // Remove existing options not present in the new options object
        for (const key of existingOptions.keys()) {
          if (!Object.prototype.hasOwnProperty.call(options, key)) {
            await this.componentOptionRepository.deleteOption(componentId, key)
          }
        }

        for (const [key, value] of Object.entries(options)) {
          if (existingOptions.has(key)) {
            await this.componentOptionRepository.updateOption(componentId, key, value)
            continue
          }

          await this.componentOptionRepository.createOption(componentId, key, value)
        }
      })
      .then(() => this.componentOptionRepository.getOptionsForComponent(componentId))
  }

  /**
   * @param {Number} id
   * @param {String} name
   *
   * @return {Promise}
   */
  updateComponent (id, name) {
    return this.componentRepository.getComponent(id)
      .then(component => this.componentRepository.updateComponent(component.id, component.type, name))
  }

  /**
   * @param {Number} id
   *
   * @return {Promise}
   */
  deleteComponent (id) {
    return this.componentRepository.deleteComponent(id)
  }
}

module.exports = ComponentService
