const socketIo = require('socket.io')
const log4js = require('log4js')

module.exports = class SocketController {
  constructor (controller) {
    this.logger = log4js.getLogger('SocketController')
    this.controller = controller

    this.sockets = new Map()
    this.pendingDisplayIds = new Set()
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

    const displayId = socket.handshake.query.displayId
    this.sockets.set(displayId, socket)

    this.authenticateDisplay(displayId)
  }

  onDisconnect (socket, reason) {
    this.logger.debug(`Socket ${socket.id} disconnected with reason ${reason}`)
    const displayId = socket.handshake.query.displayId
    this.sockets.delete(displayId)
    this.pendingDisplayIds.delete(displayId)
  }

  authenticateDisplay (displayId) {
    this.controller.findDisplay(displayId).then(display => {
      // For now the authentication check is only if there is display with that ID on file and set to active
      if (display === null || !display.active) {
        this.logger.warn(`Could not find an active display with id ${displayId}`)

        this.deauthenticateDisplay(displayId)
        return
      }

      this.sendMessageToDisplay(displayId, 'auth_success', {})
      this.setDisplayNotPending(displayId)
      this.pushConfigToDisplay(displayId)
    })
  }

  deauthenticateDisplay (displayId) {
    this.sendMessageToDisplay(displayId, 'auth_error', { message: 'Display not active' })
    this.setDisplayPending(displayId)
  }

  /**
   * Checks if the respective Display is not yet fully authenticated.
   *
   * @param {String} displayId
   * @return {boolean} True if the Display has not been fully authenticated, False otherwise.
   */
  isDisplayPending (displayId) {
    return this.pendingDisplayIds.has(displayId)
  }

  pushConfigToDisplay (displayId) {
    this.controller.findDisplay(displayId).then(display => {
      this.sendMessageToDisplay(displayId, 'update_config', {
        screenConfigs: display.screenConfigs
      })
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
    if (!Object.prototype.hasOwnProperty.call(socket.handshake.query, 'displayId')) {
      return next(new Error('Parameter displayId is missing'))
    }

    return next()
  }
}
