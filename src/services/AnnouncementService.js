const log4js = require('log4js')

class AnnouncementService {
  /**
   * @param {AnnouncementRepository} announcementRepository
   */
  constructor (announcementRepository) {
    this.announcementRepository = announcementRepository
    this.logger = log4js.getLogger('AnnouncementService')
  }

  /**
   * @param {String} title
   * @param {String} text
   * @param {Boolean} important
   *
   * @return {Promise<Object>}
   */
  createAnnouncement (title, text, important = false) {
    return this.announcementRepository.create(title, text, important)
      .then(announcement => {
        this.logger.debug('Announcement created', announcement)
        return announcement
      })
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
   *
   * @return {Promise<Object>}
   */
  updateAnnouncement (id, title, text, important) {
    return this.announcementRepository.updateOne(id, title, text, important)
  }

  /**
   * @param {Number} id
   *
   * @return {Promise}
   */
  deleteAnnouncement (id) {
    return this.announcementRepository.deleteOne(id)
  }
}

module.exports = AnnouncementService
