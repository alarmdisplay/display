const express = require('express')
const router = express.Router()

/**
 * @param {AnnouncementService} announcementService
 */
module.exports = function (announcementService) {
  /**
   * @swagger
   * definitions:
   *   Announcement:
   *     type: object
   *     required:
   *     - title
   *     - text
   *     properties:
   *       id:
   *         type: integer
   *         format: int32
   *         readOnly: true
   *       title:
   *         type: string
   *       text:
   *         type: string
   *       important:
   *         type: boolean
   *       validFrom:
   *         type: integer
   *         format: int32
   *       validTo:
   *         type: integer
   *         format: int32
   *       createdAt:
   *         type: integer
   *         format: int32
   *         readOnly: true
   *       updatedAt:
   *         type: integer
   *         format: int32
   *         readOnly: true
   */

  /**
   * @swagger
   * /api/v1/announcements/:
   *   get:
   *     summary: Returns all Announcements
   *     produces: application/json
   *     responses:
   *       200:
   *         description: All available Announcements
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Announcement'
   *     tags:
   *       - Announcements
   */
  router.get('/', (req, res, next) => {
    announcementService.getAllAnnouncements()
      .then(announcements => {
        res.json(announcements)
      })
      .catch(error => next(error))
  })

  /**
   * @swagger
   * /api/v1/announcements/:
   *   post:
   *     summary: Create a new Announcement
   *     produces: application/json
   *     parameters:
   *       - name: announcement
   *         in: body
   *         required: true
   *         description: Fields for the Announcement resource
   *         schema:
   *           $ref: '#/definitions/Announcement'
   *     responses:
   *       201:
   *         description: The newly created Announcement
   *         schema:
   *           $ref: '#/definitions/Announcement'
   *         headers:
   *           Location:
   *             description: The URI of the newly created Announcement resource
   *             type: string
   *     tags:
   *       - Announcements
   */
  router.post('/', (req, res, next) => {
    announcementService.createAnnouncement(req.body.title, req.body.text, req.body.important, req.body.validFrom, req.body.validTo)
      .then(announcement => {
        const baseUrl = req.originalUrl.replace(/\/$/, '')
        const newLocation = `${baseUrl}/${announcement.id}`
        res.set('Location', newLocation).status(201).json(announcement)
      })
      .catch(error => next(error))
  })

  /**
   * @swagger
   * /api/v1/announcements/{id}:
   *   get:
   *     summary: Returns a single Announcement
   *     produces: application/json
   *     parameters:
   *       - name: id
   *         in: path
   *         description: The ID of the Announcement
   *         type: number
   *     responses:
   *       200:
   *         description: The Announcement exists and gets returned
   *         schema:
   *           $ref: '#/definitions/Announcement'
   *       404:
   *         description: The Announcement could not be found
   *     tags:
   *       - Announcements
   */
  router.get('/:id', (req, res, next) => {
    announcementService.getAnnouncement(parseInt(req.params.id))
      .then(announcement => {
        res.json(announcement)
      })
      .catch(error => next(error))
  })

  /**
   * @swagger
   * /api/v1/announcements/{id}:
   *   put:
   *     summary: Updates a single Announcement
   *     produces: application/json
   *     parameters:
   *       - name: id
   *         in: path
   *         description: The ID of the Announcement
   *         required: true
   *         type: number
   *       - name: announcement
   *         in: body
   *         description: Fields for the Announcement resource
   *         schema:
   *           $ref: '#/definitions/Announcement'
   *     responses:
   *       200:
   *         description: Successfully updated
   *         schema:
   *           $ref: '#/definitions/Announcement'
   *       404:
   *         description: Announcement does not exist and cannot be updated. Please use POST to create a new Announcement
   *     tags:
   *       - Announcements
   */
  router.put('/:id', (req, res, next) => {
    announcementService.getAnnouncement(parseInt(req.params.id))
      .then(announcement => announcementService.updateAnnouncement(announcement.id, req.body.title, req.body.text, req.body.important, req.body.validFrom, req.body.validTo))
      .then(updatedAnnouncement => res.json(updatedAnnouncement))
      .catch(error => next(error))
  })

  /**
   * @swagger
   * /api/v1/announcements/{id}:
   *   delete:
   *     summary: Deletes a single Announcement
   *     produces: application/json
   *     parameters:
   *       - name: id
   *         in: path
   *         description: The ID of the Announcement
   *         type: string
   *     responses:
   *       204:
   *         description: Successfully deleted
   *     tags:
   *       - Announcements
   */
  router.delete('/:id', (req, res, next) => {
    announcementService.deleteAnnouncement(parseInt(req.params.id))
      .then(() => res.sendStatus(204))
      .catch(error => next(error))
  })

  return router
}
