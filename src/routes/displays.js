const express = require('express')
const router = express.Router()

module.exports = function (controller) {
  /**
   * @swagger
   * definitions:
   *   Display:
   *     type: object
   *     properties:
   *       active:
   *         type: boolean
   *       description:
   *         type: string
   *       location:
   *         type: string
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
      const displays = await controller.findDisplays()
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
   *     responses:
   *       201:
   *         description: The newly created Display
   *         schema:
   *           $ref: '#/definitions/Display'
   */
  router.post('/displays', async (req, res, next) => {
    try {
      const display = await controller.createDisplay(req.body.identifier, req.body.active, req.body.description, req.body.location)
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
   *         type: string
   *     responses:
   *       200:
   *         description: The Display model
   *         schema:
   *           $ref: '#/definitions/Display'
   *       404:
   *         description: The Display could not be found
   */
  router.get('/displays/:id', async (req, res, next) => {
    try {
      const display = await controller.findDisplay(req.params.id)
      if (!display) {
        return res.sendStatus(404)
      }
      res.json(display)
    } catch (e) {
      return next(e)
    }
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
  router.delete('/displays/:id', async (req, res, next) => {
    try {
      await controller.deleteDisplay(req.params.id)
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
   *         type: string
   *       - name: display
   *         in: body
   *         description: Fields for the Display resource
   *         schema:
   *           $ref: '#/definitions/Display'
   *     responses:
   *       200:
   *         description: Successfully updated
   */
  router.put('/:id', async (req, res, next) => {
    try {
      const display = await controller.updateDisplay(req.params.id, req.body)
      res.json(display)
    } catch (e) {
      return next(e)
    }
  })

  return router
}
