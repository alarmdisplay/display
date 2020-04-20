const express = require('express')
const log4js = require('log4js')

const IllegalArgumentError = require('./errors/IllegalArgumentError')
const NotFoundError = require('./errors/NotFoundError')

module.exports = class APIv1 {
  /**
   * @param {DisplayService} displayService
   */
  constructor (displayService) {
    this.logger = log4js.getLogger('APIv1')
    this.router = express.Router()
    this.router.use(express.json())

    // Register the routes and their handlers
    const displayRoutes = require('./routes/displays')(displayService)
    this.router.use('/displays', displayRoutes)

    // Add our own error handler to override the built-in one
    // eslint-disable-next-line no-unused-vars
    this.router.use((err, req, res, next) => {
      let statusCode = 500
      if (err instanceof IllegalArgumentError) {
        statusCode = 400
      } else if (err instanceof NotFoundError) {
        statusCode = 404
      }

      if (statusCode === 500) {
        this.logger.error(err)
      }
      res.status(statusCode).json({ error: { message: err.message } })
    })
  }
}
