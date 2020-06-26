require('dotenv').config()
const log4js = require('log4js')

const logger = log4js.getLogger()
const debugEnabled = process.env.DEBUG === '1'
logger.level = debugEnabled ? 'debug' : 'info'

const AlertService = require('./services/AlertService')
const AnnouncementService = require('./services/AnnouncementService')
const ContentService = require('./services/ContentService')
const Database = require('./persistence/Database')
const DisplayService = require('./services/DisplayService')
const SocketController = require('./sockets/SocketController')
const SocketServer = require('./sockets/SocketServer')

/**
 * Make sure that all required environment variables are set.
 */
function checkEnvironment () {
  const missingEnvs = []

  for (const env of ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'DB_PREFIX']) {
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
 * Sets up the connection to the database.
 *
 * @return {Promise<{contentSlotRepository: ContentSlotRepository, announcementRepository: AnnouncementRepository, displayRepository: DisplayRepository, viewRepository: ViewRepository, alertRepository: AlertRepository}>}
 * @throws Error If the connection to the database fails
 */
async function connectDatabase () {
  try {
    const database = new Database(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME, process.env.DB_PREFIX)
    return database.start()
  } catch (e) {
    if (e.errno && e.errno === 1045) {
      throw new Error(`Could not connect to the database: ${e.message}`)
    } else {
      throw e
    }
  }
}

connectDatabase()
  .then(({ alertRepository, announcementRepository, contentSlotRepository, displayRepository, viewRepository }) => {
    const alertService = new AlertService(alertRepository)
    const announcementService = new AnnouncementService(announcementRepository)
    const displayService = new DisplayService(displayRepository, viewRepository, contentSlotRepository)
    const contentService = new ContentService(announcementService)

    const app = require('./app')(displayService, announcementService, alertService)
    const server = require('http').createServer(app)

    const port = process.env.PORT || 3000

    const socketServer = new SocketServer()
    const socketController = new SocketController(socketServer, displayService, contentService, alertService)
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
