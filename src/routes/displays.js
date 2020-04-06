const express = require('express')
const router = express.Router()

module.exports = function (displayService) {
  /**
   * @swagger
   * definitions:
   *   Display:
   *     type: object
   *     required:
   *     - id
   *     - active
   *     - screenConfigs
   *     properties:
   *       id:
   *         type: string
   *         readOnly: true
   *       active:
   *         type: boolean
   *       description:
   *         type: string
   *       location:
   *         type: string
   *       screenConfigs:
   *         type: object
   *         properties:
   *           idleScreen:
   *             $ref: '#/definitions/ScreenConfig'
   *       createdAt:
   *         type: string
   *         format: date-time
   *         readOnly: true
   *       updatedAt:
   *         type: string
   *         format: date-time
   *         readOnly: true
   *
   *   ScreenConfig:
   *     type: object
   *     properties:
   *       layout:
   *         type: object
   *         required:
   *         - columns
   *         - components
   *         - rows
   *         properties:
   *           columns:
   *             type: integer
   *           components:
   *             type: array
   *             items:
   *               $ref: '#/definitions/ScreenConfigComponent'
   *           rows:
   *             type: integer
   *
   *   ScreenConfigComponent:
   *     type: object
   *     required:
   *     - name
   *     - bounds
   *     properties:
   *       name:
   *         type: string
   *       bounds:
   *         type: object
   *         required:
   *         - columnStart
   *         - rowStart
   *         - columnEnd
   *         - rowEnd
   *         properties:
   *           columnStart:
   *             type: integer
   *           rowStart:
   *             type: integer
   *           columnEnd:
   *             type: integer
   *           rowEnd:
   *             type: integer
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
   *     responses:
   *       201:
   *         description: The newly created Display
   *         schema:
   *           $ref: '#/definitions/Display'
   */
  router.post('/', async (req, res, next) => {
    try {
      const display = await displayService.createDisplay(req.body.name, req.body.active, req.body.clientId, req.body.description, req.body.location)
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
  router.get('/:id', async (req, res, next) => {
    try {
      const display = await displayService.getDisplayById(req.params.id)
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
  router.delete('/:id', async (req, res, next) => {
    try {
      await displayService.deleteDisplay(req.params.id)
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
   *       201:
   *         description: Display did not exist before and got created
   */
  router.put('/:id', async (req, res, next) => {
    try {
      const display = await displayService.getDisplayById(req.params.id)
      if (!display) {
        const newDisplay = await displayService.createDisplay(req.body.name, req.body.active, req.body.clientId, req.body.description, req.body.location)
        const baseUrl = req.originalUrl.replace(/\/$/, '')
        const newLocation = `${baseUrl}/${newDisplay.id}`
        res.set('Content-Location', newLocation).status(201).json(newDisplay)
        return
      }

      const updatedDisplay = await displayService.updateDisplay(req.params.id, req.body.name, req.body.active, req.body.clientId, req.body.description, req.body.location)
      res.json(updatedDisplay)
    } catch (e) {
      return next(e)
    }
  })

  return router
}
