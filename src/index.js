require('dotenv').config()
const log4js = require('log4js')
const mongoose = require('mongoose')

const logger = log4js.getLogger()
const debugEnabled = process.env.DEBUG === '1'
logger.level = debugEnabled ? 'debug' : 'info'

const DisplayService = require('./services/DisplayService')
const SocketController = require('./sockets/SocketController')
const SocketServer = require('./sockets/SocketServer')

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

/**
 * Sets up the connection to MongoDB.
 *
 * @param mongoDbUri
 * @return {Promise}
 * @throws Error If the connection to the database fails
 */
function connectDatabase (mongoDbUri) {
  logger.debug('Connecting to database...')
  return mongoose.connect(mongoDbUri, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    logger.info('Connected to database')
  }).catch((reason) => {
    throw new Error(`Could not connect to database: ${reason}`)
  })
}

connectDatabase(process.env.MONGODB_URI)
  .then(() => {
    const DisplayRepository = require('./persistence/DisplayRepository')
    const ViewRepository = require('./persistence/ViewRepository')
    const displayService = new DisplayService(new DisplayRepository(), new ViewRepository())
    const app = require('./app')(displayService)
    const server = require('http').createServer(app)

    const port = process.env.PORT || 3000

    /* socketController = new SocketController(controller)
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
    socketController.startListening(server) */

    const socketServer = new SocketServer()
    const socketController = new SocketController(socketServer, displayService)
    socketController.registerListeners()
    socketServer.startListening(server)

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
