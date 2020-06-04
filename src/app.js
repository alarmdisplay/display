const cors = require('cors')
const express = require('express')
const fs = require('fs')
const log4js = require('log4js')
const swaggerJSDoc = require('swagger-jsdoc')

/**
 * @param {DisplayService} displayService
 * @param {AnnouncementService} announcementService
 * @param {AlertService} alertService
 */
module.exports = function (displayService, announcementService, alertService) {
  const logger = log4js.getLogger()
  const app = express()

  app.use('/', express.static('static'))

  if (fs.existsSync('ext-display')) {
    app.use('/display', express.static('ext-display'))
  } else {
    logger.warn('The static files for the display frontend could not be found, the path /display will not work')
  }

  const APIv1 = require('./api')

  app.use('/api/v1', cors(), new APIv1(displayService, announcementService, alertService).router)

  // Collect the Swagger spec from the routes files and serve the JSON
  const swaggerSpec = swaggerJSDoc({
    definition: {
      info: {
        title: 'display-backend',
        version: '1.0.0'
      }
    },
    apis: ['./src/routes/*.js']
  })
  app.get('/api-docs.json', cors(), (req, res) => {
    res.json(swaggerSpec)
  })

  return app
}
