const EventEmitter = require('events')
const log4js = require('log4js')

const IllegalArgumentError = require('../errors/IllegalArgumentError')

const componentTypes = ['AnnouncementList', 'Clock', 'DWDWarningMap']

class ComponentService extends EventEmitter {
  /**
   * @param {ComponentRepository} componentRepository
   * @param {ComponentOptionRepository} componentOptionRepository
   */
  constructor (componentRepository, componentOptionRepository) {
    super()
    this.componentRepository = componentRepository
    this.componentOptionRepository = componentOptionRepository
    this.logger = log4js.getLogger('ComponentService')
  }

  createComponent (type, name, options = {}) {
    return this.validateComponentType(type)
      .then(validatedType => this.componentRepository.createComponent(validatedType, name))
      .then(newComponent => {
        return this.setOptionsForComponent(newComponent.id, options || {})
          .then(() => this.getComponent(newComponent.id))
      })
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
   * @param {Object} options
   *
   * @return {Promise}
   */
  updateComponent (id, name, options) {
    return this.componentRepository.getComponent(id)
      .then(component => this.componentRepository.updateComponent(component.id, component.type, name))
      .then(() => this.setOptionsForComponent(id, options))
      .then(() => {
        this.emit('component_updated', id)
        return this.getComponent(id)
      })
  }

  /**
   * Checks if the given Component type is known.
   *
   * @param {String} type
   *
   * @return {Promise<String>}
   */
  validateComponentType (type) {
    return new Promise((resolve, reject) => {
      if (!componentTypes.includes(type)) {
        reject(new IllegalArgumentError(`Component type '${type}' is unknown`))
        return
      }

      resolve(type)
    })
  }

  /**
   * @param {Number} id
   *
   * @return {Promise}
   */
  deleteComponent (id) {
    // TODO reject if the component is still used
    return this.componentOptionRepository.deleteOptionsForComponent(id)
      .then(() => {
        return this.componentRepository.deleteComponent(id)
      })
  }
}

module.exports = ComponentService
