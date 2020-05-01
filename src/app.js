const cors = require('cors')
const express = require('express')
const fs = require('fs')
const log4js = require('log4js')
const swaggerJSDoc = require('swagger-jsdoc')

module.exports = function (displayService, componentService) {
  const logger = log4js.getLogger()
  const app = express()

  app.get('/', function (req, res) {
    res.send('Hello World!')
  })

  if (fs.existsSync('ext-display')) {
    app.use('/display', express.static('ext-display'))
  } else {
    logger.warn('The static files for the display frontend could not be found, the path /display will not work')
  }

  const APIv1 = require('./api')

  app.use('/api/v1', cors(), new APIv1(displayService, componentService).router)

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
