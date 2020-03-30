require('dotenv').config()
const cors = require('cors')
const express = require('express')
const fs = require('fs')
const log4js = require('log4js')
const swaggerJSDoc = require('swagger-jsdoc')

const logger = log4js.getLogger()
const debugEnabled = process.env.DEBUG === '1'
logger.level = debugEnabled ? 'debug' : 'info'

const Controller = require('./controller')
const SocketController = require('./socket-controller')

/**
 * Make sure that all required environment variables are set.
 */
function checkEnvironment () {
  const missingEnvs = []

  for (const env of ['MONGODB_URI']) {
    if (!Object.prototype.hasOwnProperty.call(process.env, env)) {
      missingEnvs.push(env)
    }
  }

  if (missingEnvs.length > 0) {
    throw new Error(`The following mandatory environment variables have not been set: ${missingEnvs.join(', ')}`)
  }
}

// Catches any exception that has not been caught yet
process.setUncaughtExceptionCaptureCallback(err => {
  logger.fatal('Uncaught Exception:', err)
  process.exit(1)
})

checkEnvironment()

const controller = new Controller()
let socketController
controller.start(process.env.MONGODB_URI)
  .then(() => {
    const app = express()
    const server = require('http').createServer(app)

    const port = process.env.PORT || 3000

    app.get('/', function (req, res) {
      res.send('Hello World!')
    })

    if (fs.existsSync('ext-display')) {
      app.use('/display', express.static('ext-display'))
    } else {
      logger.warn('The static files for the display frontend could not be found, the path /display will not work')
    }

    const APIv1 = require('./api')
    app.use('/api/v1', cors(), new APIv1(controller).router)

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

    socketController = new SocketController(controller)
    controller.on('display_created', display => {
      logger.debug(`Display ${display.id} has been created`)
      if (socketController.isDisplayPending(display.id)) {
        // Try to authenticate again.
        socketController.authenticateDisplay(display.id)
      }
    })
    controller.on('display_updated', display => {
      logger.debug(`Display ${display.id} has been updated`)
      socketController.authenticateDisplay(display.id)
    })
    controller.on('display_deleted', displayId => {
      logger.debug(`Display ${displayId} has been deleted`)
      socketController.deauthenticateDisplay(displayId)
    })
    socketController.startListening(server)

    server.on('error', err => {
      logger.error('Server error:', err)
    })
    server.on('listening', () => {
      const address = server.address()
      logger.info(`Server listens on port ${address.port}`)
    })
    server.listen(port)
  })
  .catch(reason => {
    logger.fatal('Could not start the server', reason)
    process.exit(2)
  })
