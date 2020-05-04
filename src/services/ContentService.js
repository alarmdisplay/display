const EventEmitter = require('events')

class ContentService extends EventEmitter {
  /**
   * @param {ComponentService} componentService
   */
  constructor (componentService) {
    super()
    this.componentService = componentService
  }

  getContentForComponent (component) {
    return new Promise(resolve => {
      switch (component.type) {
        case 'AnnouncementList':
          // Return a random number of announcements on each call
          resolve(Array(Math.floor(Math.random() * 5)).fill({ title: 'Die Überschrift', text: 'Ein bisschen Text', issued: new Date() }))
          return
        default:
          resolve()
      }
    })
  }

  /**
   * @param {Object[]} components
   *
   * @return {Promise<Object>}
   */
  getContentForComponents (components) {
    return Promise.resolve()
      .then(async () => {
        const content = {}
        for (const component of components) {
          content[component.id] = await this.getContentForComponent(component)
        }
        return content
      })
  }
}

module.exports = ContentService
