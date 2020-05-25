const NotFoundError = require('../../errors/NotFoundError')

class AnnouncementRepository {
  constructor () {
    this.announcements = new Map()
    this.instanceCounter = 1
  }

  /**
   * @param {String} title
   * @param {String} text
   * @param {Boolean} important
   * @param {Number} validFrom
   * @param {Number} validTo
   */
  create (title, text, important, validFrom, validTo) {
    return new Promise(resolve => {
      const newAnnouncement = {
        id: this.instanceCounter++,
        title: title || '',
        text: text || '',
        important: important,
        validFrom: validFrom,
        validTo: validTo,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      this.announcements.set(newAnnouncement.id, newAnnouncement)
      resolve(newAnnouncement)
    })
  }

  /**
   * @return {Promise<Object[]>}
   */
  getAll () {
    return new Promise(resolve => {
      const announcements = []
      this.announcements.forEach(storedAnnouncement => {
        // Clone each Announcement, so each recipient modifies their own copy
        const announcement = {}
        for (const prop of Object.getOwnPropertyNames(storedAnnouncement)) {
          announcement[prop] = storedAnnouncement[prop]
        }
        announcements.push(announcement)
      })
      resolve(announcements)
    })
  }

  /**
   * @param {Number} id
   *
   * @return {Promise<Object>}
   */
  getOne (id) {
    return new Promise((resolve, reject) => {
      if (!this.announcements.has(id)) {
        return reject(new NotFoundError(`No Announcement with ID ${id} found`))
      }

      // Clone the Announcement, so each recipient modifies their own copy
      const announcement = {}
      const storedAnnouncement = this.announcements.get(id)
      for (const prop of Object.getOwnPropertyNames(storedAnnouncement)) {
        announcement[prop] = storedAnnouncement[prop]
      }
      resolve(announcement)
    })
  }

  /**
   * @param {Number} id
   *
   * @return {Promise}
   */
  deleteOne (id) {
    return new Promise(resolve => {
      const itemDidExist = this.announcements.delete(id)
      if (itemDidExist) {
        resolve(id)
      } else {
        resolve(undefined)
      }
    })
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
  updateOne (id, title, text, important, validFrom, validTo) {
    return this.getOne(id)
      .then(announcement => {
        const updatedAnnouncement = {
          id: announcement.id,
          title: title,
          text: text,
          important: important,
          validFrom: validFrom,
          validTo: validTo,
          createdAt: announcement.createdAt,
          updatedAt: Date.now()
        }
        this.announcements.set(id, updatedAnnouncement)
        return updatedAnnouncement
      })
  }
}

module.exports = AnnouncementRepository
