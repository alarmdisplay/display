const IllegalArgumentError = require('../errors/IllegalArgumentError')

const componentTypes = ['AnnouncementList', 'Clock', 'DWDWarningMap']

class ComponentService {
  /**
   * @param {ComponentRepository} componentRepository
   */
  constructor (componentRepository) {
    this.componentRepository = componentRepository
  }

  createComponent (type, name) {
    return new Promise((resolve, reject) => {
      if (!componentTypes.includes(type)) {
        reject(new IllegalArgumentError(`Component type '${type}' is unknown`))
        return
      }

      resolve(this.componentRepository.createComponent(type, name))
    })
  }

  getAllComponents () {
    return this.componentRepository.getAllComponents()
  }

  /**
   * @return {Promise<Map<Number, Object>>}
   */
  getAllComponentsAsMap () {
    return this.componentRepository.getAllComponents()
      .then(components => {
        const map = new Map()
        for (const component of components) {
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
    return this.componentRepository.getComponent(id)
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
