const EventEmitter = require('events')

class ContentService extends EventEmitter {
  /**
   * @param {AnnouncementService} announcementService
   */
  constructor (announcementService) {
    super()
    this.announcementService = announcementService
    this.announcementService.on('created', () => this.emit('content_changed', 'Announcement'))
    this.announcementService.on('updated', () => this.emit('content_changed', 'Announcement'))
    this.announcementService.on('deleted', () => this.emit('content_changed', 'Announcement'))
  }

  getContentForComponent (component) {
    switch (component.type) {
      case 'AnnouncementList':
        return this.announcementService.getAllAnnouncements()
      default:
        return Promise.resolve()
    }
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
