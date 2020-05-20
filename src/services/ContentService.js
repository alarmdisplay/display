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
}

module.exports = ContentService
