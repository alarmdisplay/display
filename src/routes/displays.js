const express = require('express')
const router = express.Router()

const IllegalArgumentError = require('../errors/IllegalArgumentError')
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
   *
   *   View:
   *     type: object
   *     required:
   *     - columns
   *     - rows
   *     - screenType
   *     properties:
   *       id:
   *         type: number
   *         readOnly: true
   *       columns:
   *         type: number
   *         minimum: 1
   *       rows:
   *         type: number
   *         minimum: 1
   *       displayId:
   *         type: number
   *         readOnly: true
   *       order:
   *         type: number
   *         readOnly: true
   *       screenType:
   *         type: string
   *       contentSlots:
   *         type: array
   *         items:
   *           $ref: '#/definitions/ContentSlot'
   *
   *   ContentSlot:
   *     type: object
   *     required:
   *       - componentType
   *       - columnStart
   *       - rowStart
   *       - columnEnd
   *       - rowEnd
   *     properties:
   *       componentType:
   *         type: string
   *         enum:
   *         - AnnouncementList
   *         - Clock
   *         - DWDWarningMap
   *       viewId:
   *         type: number
   *         readOnly: true
   *       columnStart:
   *         type: number
   *       rowStart:
   *         type: number
   *       columnEnd:
   *         type: number
   *       rowEnd:
   *         type: number
   *       options:
   *         type: object
   */

  /**
   * @swagger
   * /api/v1/displays/:
   *   get:
   *     summary: Returns all Displays
   *     produces: application/json
   *     responses:
   *       200:
   *         description: All available Displays
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Display'
   *     tags:
   *       - Displays
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
   *     summary: Create a new Display
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
   *     tags:
   *       - Displays
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
   *     summary: Returns a single Display
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
   *     tags:
   *       - Displays
   */
  router.get('/:id', async (req, res, next) => {
    try {
      const display = await displayService.getDisplayById(parseInt(req.params.id))
      if (!display) {
        next(new NotFoundError(`No Display with ID ${req.params.id} found`))
        return
      }
      res.json(display)
    } catch (e) {
      next(e)
    }
  })

  /**
   * @swagger
   * /api/v1/displays/{id}:
   *   put:
   *     summary: Updates a single Display
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
   *     tags:
   *       - Displays
   */
  router.put('/:id', async (req, res, next) => {
    try {
      const updatedDisplay = await displayService.updateDisplay(parseInt(req.params.id), req.body.name, req.body.active, req.body.clientId, req.body.description, req.body.location)
      if (!updatedDisplay) {
        next(new NotFoundError(`No Display with ID ${req.params.id} found`))
        return
      }
      res.json(updatedDisplay)
    } catch (e) {
      next(e)
    }
  })

  /**
   * @swagger
   * /api/v1/displays/{id}:
   *   delete:
   *     summary: Deletes a single Display
   *     produces: application/json
   *     parameters:
   *       - name: id
   *         in: path
   *         type: string
   *     responses:
   *       204:
   *         description: Successfully deleted
   *     tags:
   *       - Displays
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
   * /api/v1/displays/{id}/views:
   *   get:
   *     summary: Returns all Views for a Display
   *     produces: application/json
   *     parameters:
   *       - name: id
   *         in: path
   *         description: The ID of the Display
   *         required: true
   *         type: number
   *     responses:
   *       200:
   *         description: All available Views for this Displays
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/View'
   *     tags:
   *       - Views
   */
  router.get('/:id/views', async (req, res, next) => {
    try {
      const displayId = parseInt(req.params.id)
      const display = await displayService.getDisplayById(displayId)
      if (!display) {
        next(new NotFoundError(`No Display with ID ${displayId} found`))
        return
      }

      const views = await displayService.getViewsForDisplay(displayId)
      res.json(views)
    } catch (e) {
      next(e)
    }
  })

  /**
   * @swagger
   * /api/v1/displays/{id}/views:
   *   post:
   *     summary: Adds a new View to a Display
   *     produces: application/json
   *     parameters:
   *       - name: id
   *         in: path
   *         description: The ID of the Display
   *         required: true
   *         type: number
   *       - name: view
   *         in: body
   *         required: true
   *         description: Fields for the View resource
   *         schema:
   *           $ref: '#/definitions/View'
   *     responses:
   *       201:
   *         description: The newly created View
   *         schema:
   *           $ref: '#/definitions/View'
   *         headers:
   *           Location:
   *             description: The URI of the newly created View resource
   *             type: string
   *       400:
   *         description: The submitted data was not correct
   *     tags:
   *       - Views
   */
  router.post('/:id/views', async (req, res, next) => {
    try {
      const displayId = parseInt(req.params.id)
      const display = await displayService.getDisplayById(displayId)
      if (!display) {
        next(new IllegalArgumentError(`There is no Display with ID ${displayId}`))
        return
      }

      const view = await displayService.createView(displayId, req.body.screenType, parseInt(req.body.columns), parseInt(req.body.rows))
      const baseUrl = req.originalUrl.replace(/\/$/, '')
      const newLocation = `${baseUrl}/${display.id}/views/${view.id}`
      res.set('Location', newLocation).status(201).json(view)
    } catch (e) {
      next(e)
    }
  })

  /**
   * @swagger
   * /api/v1/displays/{displayId}/view/{viewId}:
   *   get:
   *     summary: Returns a single View of a specific Display
   *     produces: application/json
   *     parameters:
   *       - name: displayId
   *         in: path
   *         description: The ID of the Display
   *         type: number
   *       - name: viewId
   *         in: path
   *         description: The ID of the View
   *         type: number
   *     responses:
   *       200:
   *         description: The View model
   *         schema:
   *           $ref: '#/definitions/View'
   *       404:
   *         description: The View could not be found. It can also mean that the Display does not exist.
   *     tags:
   *       - Views
   */
  router.get('/:id/views/:viewId', async (req, res, next) => {
    try {
      const displayId = parseInt(req.params.id)
      const display = await displayService.getDisplayById(displayId)
      if (!display) {
        next(new NotFoundError(`No Display with ID ${displayId} found`))
        return
      }

      const viewId = parseInt(req.params.viewId)
      const view = await displayService.getView(viewId)
      if (!view || view.displayId !== display.id) {
        next(new NotFoundError(`The Display ${displayId} does not have a View with ID ${viewId}`))
        return
      }
      res.json(view)
    } catch (e) {
      next(e)
    }
  })

  /**
   * @swagger
   * /api/v1/displays/{displayId}/view/{viewId}:
   *   put:
   *     summary: Updates a single View of a Display
   *     produces: application/json
   *     parameters:
   *       - name: displayId
   *         in: path
   *         description: The ID of the Display
   *         type: number
   *       - name: viewId
   *         in: path
   *         description: The ID of the View
   *         type: number
   *       - name: view
   *         in: body
   *         description: Fields for the View resource
   *         schema:
   *           $ref: '#/definitions/View'
   *     responses:
   *       200:
   *         description: Successfully updated
   *         schema:
   *           $ref: '#/definitions/View'
   *       404:
   *         description: A View (or Display) with that ID does not exist and cannot be updated. Please use POST to add a View.
   *     tags:
   *       - Views
   */
  router.put('/:id/views/:viewId', async (req, res, next) => {
    try {
      const displayId = parseInt(req.params.id)
      const viewId = parseInt(req.params.viewId)
      const display = await displayService.getDisplayById(displayId)
      if (!display) {
        next(new NotFoundError(`No Display with ID ${displayId} found`))
        return
      }

      const view = await displayService.getView(viewId)
      if (!view || view.displayId !== display.id) {
        next(new NotFoundError(`The Display ${displayId} does not have a View with ID ${viewId}`))
        return
      }

      const updatedView = await displayService.updateView(viewId, req.body.columns, req.body.rows, req.body.contentSlots)
      res.json(updatedView)
    } catch (e) {
      next(e)
    }
  })

  /**
   * @swagger
   * /api/v1/displays/{displayId}/view/{viewId}:
   *   delete:
   *     summary: Removes a single View from a Display
   *     produces: application/json
   *     parameters:
   *       - name: displayId
   *         in: path
   *         description: The ID of the Display
   *         type: number
   *       - name: viewId
   *         in: path
   *         description: The ID of the View
   *         type: number
   *     responses:
   *       204:
   *         description: Successfully deleted
   *     tags:
   *       - Views
   */
  router.delete('/:id/views/:viewId', async (req, res, next) => {
    const viewId = parseInt(req.params.viewId)
    // Just delete, it does not matter if Display or View exist, the user wants them gone anyway
    await displayService.deleteView(viewId)
    res.sendStatus(204)
  })

  return router
}
