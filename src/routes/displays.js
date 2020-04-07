const express = require('express')
const router = express.Router()

const NotFoundError = require('../errors/NotFoundError')

module.exports = function (displayService) {
  /**
   * @swagger
   * definitions:
   *   Display:
   *     type: object
   *     required:
   *     - name
   *     properties:
   *       id:
   *         type: number
   *         readOnly: true
   *       name:
   *         type: string
   *       active:
   *         type: boolean
   *         default: false
   *       clientId:
   *         type: string
   *         default: ''
   *       description:
   *         type: string
   *         default: ''
   *       location:
   *         type: string
   *         default: ''
   */

  /**
   * @swagger
   * /api/v1/displays/:
   *   get:
   *     description: Returns all Displays
   *     produces: application/json
   *     responses:
   *       200:
   *         description: All available Displays
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Display'
   */
  router.get('/', async (req, res, next) => {
    try {
      const displays = await displayService.getAllDisplays()
      res.json(displays)
    } catch (e) {
      return next(e)
    }
  })

  /**
   * @swagger
   * /api/v1/displays/:
   *   post:
   *     description: Create a new Display
   *     produces: application/json
   *     parameters:
   *       - name: display
   *         in: body
   *         required: true
   *         description: Fields for the Display resource
   *         schema:
   *           $ref: '#/definitions/Display'
   *     responses:
   *       201:
   *         description: The newly created Display
   *         schema:
   *           $ref: '#/definitions/Display'
   *         headers:
   *           Location:
   *             description: The URI of the newly created Display resource
   *             type: string
   */
  router.post('/', async (req, res, next) => {
    try {
      const display = await displayService.createDisplay(
        req.body.name,
        req.body.active || false,
        req.body.clientId || '',
        req.body.description || '',
        req.body.location || ''
      )
      const baseUrl = req.originalUrl.replace(/\/$/, '')
      const newLocation = `${baseUrl}/${display.id}`
      res.set('Location', newLocation).status(201).json(display)
    } catch (e) {
      return next(e)
    }
  })

  /**
   * @swagger
   * /api/v1/displays/{id}:
   *   get:
   *     description: Returns a single Display
   *     produces: application/json
   *     parameters:
   *       - name: id
   *         in: path
   *         type: number
   *     responses:
   *       200:
   *         description: The Display model
   *         schema:
   *           $ref: '#/definitions/Display'
   *       404:
   *         description: The Display could not be found
   */
  router.get('/:id', (req, res, next) => {
    displayService.getDisplayById(parseInt(req.params.id))
      .then(display => {
        res.json(display)
      }, reason => {
        if (reason instanceof NotFoundError) {
          return res.sendStatus(404)
        }

        return next(reason)
      })
  })

  /**
   * @swagger
   * /api/v1/displays/{id}:
   *   delete:
   *     description: Deletes a single Display
   *     produces: application/json
   *     parameters:
   *       - name: id
   *         in: path
   *         type: string
   *     responses:
   *       204:
   *         description: Successfully deleted
   */
  router.delete('/:id', async (req, res, next) => {
    try {
      await displayService.deleteDisplay(parseInt(req.params.id))
      res.sendStatus(204)
    } catch (e) {
      return next(e)
    }
  })

  /**
   * @swagger
   * /api/v1/displays/{id}:
   *   put:
   *     description: Updates a single Display
   *     produces: application/json
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         type: number
   *       - name: display
   *         in: body
   *         description: Fields for the Display resource
   *         schema:
   *           $ref: '#/definitions/Display'
   *     responses:
   *       200:
   *         description: Successfully updated
   *         schema:
   *           $ref: '#/definitions/Display'
   *       404:
   *         description: Display does not exist and cannot be updated. Please use POST to create a new Display
   */
  router.put('/:id', (req, res, next) => {
    displayService.getDisplayById(parseInt(req.params.id))
      .then(() => {
        // Display exists
        return displayService.updateDisplay(parseInt(req.params.id), req.body.name, req.body.active, req.body.clientId, req.body.description, req.body.location)
          .then(updatedDisplay => res.json(updatedDisplay))
      }, (reason) => {
        if (reason instanceof NotFoundError) {
          // Display does not exist
          return res.sendStatus(404)
        }

        throw reason
      })
      .catch(reason => next(reason))
  })

  return router
}
