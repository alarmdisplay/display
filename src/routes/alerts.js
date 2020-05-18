const express = require('express')
const router = express.Router()

/**
 * @param {AlertService} alertService
 */
module.exports = function (alertService) {
  /**
   * @swagger
   * definitions:
   *   Alert:
   *     type: object
   *     properties:
   *       id:
   *         type: integer
   *         format: int32
   *         readOnly: true
   *       title:
   *         type: string
   *         default: Einsatz
   *       description:
   *         type: string
   *       time:
   *         type: integer
   *         format: int32
   *         description: Timestamp of the alert, defaults to time of request if not provided
   *       location:
   *         type: string
   *         readOnly: true
   *       status:
   *         type: string
   *         enum:
   *         - Actual
   *         - Exercise
   *         - Test
   *         default: Actual
   *       category:
   *         type: string
   *         enum:
   *         - Geo
   *         - Met
   *         - Safety
   *         - Security
   *         - Rescue
   *         - Fire
   *         - Health
   *         - Env
   *         - Transport
   *         - Infra
   *         - CBRNE
   *         - Other
   *         description: Based on the alert categories of the CAP format
   *         default: Other
   *       contact:
   *         type: string
   *       updatedAt:
   *         type: integer
   *         format: int32
   *         description: Timestamp of the last update
   */

  /**
   * @swagger
   * /api/v1/alerts/:
   *   get:
   *     summary: Returns all Alerts
   *     produces: application/json
   *     responses:
   *       200:
   *         description: All available Alerts
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Alert'
   *     tags:
   *       - Alerts
   */
  router.get('/', (req, res, next) => {
    alertService.getAllAlerts()
      .then(alerts => {
        res.json(alerts)
      })
      .catch(error => next(error))
  })

  /**
   * @swagger
   * /api/v1/alerts/:
   *   post:
   *     summary: Create a new Alert
   *     produces: application/json
   *     parameters:
   *       - name: alert
   *         in: body
   *         required: true
   *         description: Fields for the Alert resource
   *         schema:
   *           $ref: '#/definitions/Alert'
   *     responses:
   *       201:
   *         description: The newly created Alert
   *         schema:
   *           $ref: '#/definitions/Alert'
   *         headers:
   *           Location:
   *             description: The URI of the newly created Alert resource
   *             type: string
   *     tags:
   *       - Alerts
   */
  router.post('/', (req, res, next) => {
    alertService.createAlert(
      req.body.title,
      req.body.keyword,
      req.body.description,
      req.body.time,
      req.body.location,
      req.body.status,
      req.body.category,
      req.body.contact
    )
      .then(alert => {
        const baseUrl = req.originalUrl.replace(/\/$/, '')
        const newLocation = `${baseUrl}/${alert.id}`
        res.set('Location', newLocation).status(201).json(alert)
      })
      .catch(error => next(error))
  })

  /**
   * @swagger
   * /api/v1/alerts/{id}:
   *   get:
   *     summary: Returns a single Alert
   *     produces: application/json
   *     parameters:
   *       - name: id
   *         in: path
   *         description: The ID of the Alert
   *         type: number
   *     responses:
   *       200:
   *         description: The Alert exists and gets returned
   *         schema:
   *           $ref: '#/definitions/Alert'
   *       404:
   *         description: The Alert could not be found
   *     tags:
   *       - Alerts
   */
  router.get('/:id', (req, res, next) => {
    alertService.getAlert(parseInt(req.params.id))
      .then(alert => {
        res.json(alert)
      })
      .catch(error => next(error))
  })

  /**
   * @swagger
   * /api/v1/alerts/{id}:
   *   delete:
   *     summary: Deletes a single Alert
   *     produces: application/json
   *     parameters:
   *       - name: id
   *         in: path
   *         description: The ID of the Alert
   *         type: string
   *     responses:
   *       204:
   *         description: Successfully deleted
   *     tags:
   *       - Alerts
   */
  router.delete('/:id', (req, res, next) => {
    alertService.removeAlert(parseInt(req.params.id))
      .then(() => res.sendStatus(204))
      .catch(error => next(error))
  })

  return router
}
