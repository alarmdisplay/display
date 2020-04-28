const express = require('express')
const router = express.Router()

/**
 * @param {ComponentService} componentService
 */
module.exports = function (componentService) {
  /**
   * @swagger
   * definitions:
   *   Component:
   *     type: object
   *     required:
   *     - name
   *     - type
   *     properties:
   *       id:
   *         type: number
   *         readOnly: true
   *       name:
   *         type: string
   *       type:
   *         type: string
   *         enum:
   *         - AnnouncementList
   *         - Clock
   *         - DWDWarningMap
   */

  /**
   * @swagger
   * /api/v1/components/:
   *   post:
   *     summary: Create a new Component
   *     produces: application/json
   *     parameters:
   *       - name: component
   *         in: body
   *         required: true
   *         description: Fields for the Component resource
   *         schema:
   *           $ref: '#/definitions/Component'
   *     responses:
   *       201:
   *         description: The newly created Component
   *         schema:
   *           $ref: '#/definitions/Component'
   *         headers:
   *           Location:
   *             description: The URI of the newly created Component resource
   *             type: string
   *     tags:
   *       - Components
   */
  router.post('/', (req, res, next) => {
    componentService.createComponent(req.body.type || '', req.body.name || '')
      .then(component => {
        const baseUrl = req.originalUrl.replace(/\/$/, '')
        const newLocation = `${baseUrl}/${component.id}`
        res.set('Location', newLocation).status(201).json(component)
      })
      .catch(error => next(error))
  })

  /**
   * @swagger
   * /api/v1/components/:
   *   get:
   *     summary: Returns all Components
   *     produces: application/json
   *     responses:
   *       200:
   *         description: All available Components
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Component'
   *     tags:
   *       - Components
   */
  router.get('/', (req, res, next) => {
    componentService.getAllComponents()
      .then(components => {
        res.json(components)
      })
      .catch(error => next(error))
  })

  /**
   * @swagger
   * /api/v1/components/{id}:
   *   get:
   *     summary: Returns a single Component
   *     produces: application/json
   *     parameters:
   *       - name: id
   *         in: path
   *         description: The ID of the Component
   *         type: number
   *     responses:
   *       200:
   *         description: The Component exists and gets returned
   *         schema:
   *           $ref: '#/definitions/Component'
   *       404:
   *         description: The Component could not be found
   *     tags:
   *       - Components
   */
  router.get('/:id', (req, res, next) => {
    componentService.getComponent(parseInt(req.params.id))
      .then(component => {
        res.json(component)
      })
      .catch(error => next(error))
  })

  /**
   * @swagger
   * /api/v1/components/{id}:
   *   put:
   *     summary: Updates a single Component
   *     produces: application/json
   *     parameters:
   *       - name: id
   *         in: path
   *         description: The ID of the Component
   *         required: true
   *         type: number
   *       - name: component
   *         in: body
   *         description: Fields for the Component resource
   *         schema:
   *           type: object
   *           properties:
   *             name:
   *               type: string
   *     responses:
   *       200:
   *         description: Successfully updated
   *         schema:
   *           $ref: '#/definitions/Component'
   *       404:
   *         description: Component does not exist and cannot be updated. Please use POST to create a new Component
   *     tags:
   *       - Components
   */
  router.put('/:id', (req, res, next) => {
    componentService.getComponent(parseInt(req.params.id))
      .then(component => componentService.updateComponent(component.id, req.body.name || ''))
      .then(updatedComponent => res.json(updatedComponent))
      .catch(error => next(error))
  })

  /**
   * @swagger
   * /api/v1/components/{id}:
   *   delete:
   *     summary: Deletes a single Component
   *     produces: application/json
   *     parameters:
   *       - name: id
   *         in: path
   *         description: The ID of the Component
   *         type: string
   *     responses:
   *       204:
   *         description: Successfully deleted
   *     tags:
   *       - Components
   */
  router.delete('/:id', (req, res, next) => {
    componentService.deleteComponent(parseInt(req.params.id))
      .then(() => res.sendStatus(204))
      .catch(error => next(error))
  })

  return router
}
