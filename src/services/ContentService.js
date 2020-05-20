const EventEmitter = require('events')

class ContentService extends EventEmitter {
  /**
   * @param {AnnouncementService} announcementService
   */
  constructor (announcementService) {
    super()
    this.announcementService = announcementService

    this.componentTypes = new Map()
    this.componentTypes.set('AnnouncementList', { contentType: 'Announcement' })
    this.componentTypes.set('Clock', { contentType: '' })
    this.componentTypes.set('DWDWarningMap', { contentType: '' })

    this.announcementService.on('created', () => this.emit('content_changed', 'Announcement'))
    this.announcementService.on('updated', () => this.emit('content_changed', 'Announcement'))
    this.announcementService.on('deleted', () => this.emit('content_changed', 'Announcement'))
  }

  getContentForContentSlot (contentSlot) {
    switch (contentSlot.componentType) {
      case 'AnnouncementList':
        return this.announcementService.getAllAnnouncements()
      default:
        return Promise.resolve()
    }
  }

  /**
   * @param {Object[]} contentSlots
   *
   * @return {Promise<Object>}
   */
  getContentForContentSlots (contentSlots) {
    return Promise.resolve()
      .then(async () => {
        const content = {}
        for (const contentSlot of contentSlots) {
          content[contentSlot.id] = await this.getContentForContentSlot(contentSlot)
        }
        return content
      })
  }

  getComponentTypesForContentType (contentType) {
    return new Promise((resolve, reject) => {
      if (!contentType) {
        reject(new Error('Invalid content type'))
        return
      }

      const components = []
      this.componentTypes.forEach((properties, identifier) => {
        if (properties.contentType === contentType) {
          components.push(identifier)
        }
      })
      resolve(components)
    })
  }
}

module.exports = ContentService
