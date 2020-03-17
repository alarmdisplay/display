require('dotenv').config()
const app = require('express')()
const cors = require('cors')
const http = require('http').createServer(app)
const io = require('socket.io')(http)
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
    if (!process.env.hasOwnProperty(env)) {
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
    const port = process.env.PORT || 3000

    app.get('/', function (req, res) {
      res.send('Hello World!')
    })

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
      apis: ['./routes/*.js']
    })
    app.get('/api-docs.json', cors(), (req, res) => {
      res.json(swaggerSpec)
    })

    socketController = new SocketController(io, controller)

    http.on('error', err => {
      logger.error('Server error:', err)
    })
    http.on('listening', () => {
      const address = http.address()
      logger.info(`Server listens on port ${address.port}`)
    })
    http.listen(port)
  })
  .catch(reason => {
    logger.fatal('Could not start the server', reason)
    process.exit(2)
  })
