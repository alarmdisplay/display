const express = require('express')
const router = express.Router()

const NotFoundError = require('../errors/NotFoundError')

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
  router.get('/', async (req, res, next) => {
    try {
      const announcements = await announcementService.getAllAnnouncements()
      res.json(announcements)
    } catch (e) {
      return next(e)
    }
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
  router.post('/', async (req, res, next) => {
    try {
      const announcement = await announcementService.createAnnouncement(req.body.title, req.body.text, req.body.important, req.body.validFrom, req.body.validTo)
      const baseUrl = req.originalUrl.replace(/\/$/, '')
      const newLocation = `${baseUrl}/${announcement.id}`
      res.set('Location', newLocation).status(201).json(announcement)
    } catch (e) {
      return next(e)
    }
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
  router.get('/:id', async (req, res, next) => {
    try {
      const announcement = await announcementService.getAnnouncement(parseInt(req.params.id))
      if (!announcement) {
        next(new NotFoundError(`No Announcement with ID ${req.params.id} found`))
        return
      }
      res.json(announcement)
    } catch (e) {
      next(e)
    }
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
  router.put('/:id', async (req, res, next) => {
    try {
      const announcementId = parseInt(req.params.id)
      const announcement = await announcementService.updateAnnouncement(announcementId, req.body.title, req.body.text, req.body.important, req.body.validFrom, req.body.validTo)
      if (!announcement) {
        next(new NotFoundError(`No Announcement with ID ${announcementId} found`))
        return
      }
      res.json(announcement)
    } catch (e) {
      next(e)
    }
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
  router.delete('/:id', async (req, res, next) => {
    try {
      await announcementService.deleteAnnouncement(parseInt(req.params.id))
      res.sendStatus(204)
    } catch (e) {
      return next(e)
    }
  })

  return router
}
