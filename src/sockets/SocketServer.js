const EventEmitter = require('events')
const socketIo = require('socket.io')
const log4js = require('log4js')

class SocketServer extends EventEmitter {
  constructor () {
    super()
    this.sockets = new Map()
    this.pendingDisplayIds = new Set()
    this.logger = log4js.getLogger('SocketServer')
  }

  /**
   * Start listening for socket connections.
   *
   * @param server
   */
  startListening (server) {
    this.io = socketIo(server)
    this.io.use((socket, next) => this.verifyNewSocket(socket, next))
    this.io.on('connection', socket => this.onConnected(socket))
  }

  onConnected (socket) {
    this.logger.debug(`Socket ${socket.id} connected`)

    socket.on('error', (error) => this.logger.error(`Socket ${socket.id}`, error))
    socket.once('disconnect', (reason) => this.onDisconnect(socket, reason))

    const clientId = socket.handshake.query.clientId
    this.setDisplayPending(clientId)
    this.sockets.set(clientId, socket)
    this.emit('socket_connected', clientId)
  }

  onDisconnect (socket, reason) {
    this.logger.debug(`Socket ${socket.id} disconnected with reason ${reason}`)
    const clientId = socket.handshake.query.clientId
    this.sockets.delete(clientId)
    this.setDisplayNotPending(clientId)
  }

  authenticateDisplay (clientId) {
    this.sendMessageToDisplay(clientId, 'auth_success', {})
    this.setDisplayNotPending(clientId)
  }

  deauthenticateDisplay (displayId, message) {
    this.sendMessageToDisplay(displayId, 'auth_error', { message: message })
    this.setDisplayPending(displayId)
  }

  /**
   * Checks if the respective Display is not yet fully authenticated.
   *
   * @param {Number} displayId
   * @return {boolean} True if the Display has not been fully authenticated, False otherwise.
   */
  isDisplayPending (displayId) {
    return this.pendingDisplayIds.has(displayId)
  }

  pushConfigToDisplay (clientId, config) {
    // TODO
    this.sendMessageToDisplay(clientId, 'update_config', {
      screenConfigs: [],
      config
    })
  }

  sendMessageToDisplay (identifier, eventName, message) {
    const socket = this.sockets.get(identifier)
    if (!socket) {
      this.logger.warn(`No socket for ID ${identifier}, not sending message`)
      return
    }

    socket.emit(eventName, message)
  }

  setDisplayPending (displayId) {
    if (this.isDisplayPending(displayId)) {
      return
    }

    this.pendingDisplayIds.add(displayId)
  }

  setDisplayNotPending (displayId) {
    this.pendingDisplayIds.delete(displayId)
  }

  /**
   * socket.io middleware to verify if a new socket connection should be allowed (i.e. sends the required data)
   *
   * @param socket
   * @param next
   */
  verifyNewSocket (socket, next) {
    if (!Object.prototype.hasOwnProperty.call(socket.handshake.query, 'clientId')) {
      this.logger.warn(`Socket ${socket.id} rejected because of missing Client ID`)
      return next(new Error('Parameter clientId is missing'))
    }

    return next()
  }
}

module.exports = SocketServer
