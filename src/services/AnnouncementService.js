const EventEmitter = require('events')
const log4js = require('log4js')

class AnnouncementService extends EventEmitter {
  /**
   * @param {AnnouncementRepository} announcementRepository
   */
  constructor (announcementRepository) {
    super()
    this.announcementRepository = announcementRepository
    this.logger = log4js.getLogger('AnnouncementService')
  }

  /**
   * @param {String} title
   * @param {String} text
   * @param {Boolean} important
   * @param {Number} validFrom
   * @param {Number} validTo
   *
   * @return {Promise<Object>}
   */
  async createAnnouncement (title, text, important = false, validFrom = null, validTo = null) {
    const id = await this.announcementRepository.create(title || '', text || '', important, validFrom, validTo)
    const announcement = await this.announcementRepository.getOne(id)
    this.emit('created', announcement.id)
    return announcement
  }

  /**
   * @return {Promise<Object[]>}
   */
  getAllAnnouncements () {
    return this.announcementRepository.getAll()
  }

  /**
   * @param {Number} id
   *
   * @return {Promise<Object>}
   */
  getAnnouncement (id) {
    return this.announcementRepository.getOne(id)
  }

  /**
   * @param {Number} id
   * @param {String} title
   * @param {String} text
   * @param {Boolean} important
   * @param {Number} validFrom
   * @param {Number} validTo
   *
   * @return {Promise<Object>}
   */
  async updateAnnouncement (id, title, text, important = false, validFrom = null, validTo = null) {
    const announcementId = await this.announcementRepository.updateOne(id, title || '', text || '', important, validFrom, validTo)
    if (!announcementId) {
      return this.getAnnouncement(id)
    }

    const updatedAnnouncement = await this.getAnnouncement(announcementId)
    this.emit('updated', updatedAnnouncement.id)
    return updatedAnnouncement
  }

  /**
   * @param {Number} id
   *
   * @return {Promise}
   */
  deleteAnnouncement (id) {
    return this.announcementRepository.deleteOne(id)
      .then(result => {
        this.emit('deleted', id)
        return result
      })
  }
}

module.exports = AnnouncementService
