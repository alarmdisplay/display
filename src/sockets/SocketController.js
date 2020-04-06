const log4js = require('log4js')

class SocketController {
  /**
   * @param {SocketServer} socketServer
   * @param {DisplayService} displayService
   */
  constructor (socketServer, displayService) {
    this.socketServer = socketServer
    this.displayService = displayService
    this.logger = log4js.getLogger('SocketController')
  }

  registerListeners () {
    this.socketServer.on('socket_connected', socketId => this.onSocketConnected(socketId))
    this.displayService.on('display_created', display => {
      this.logger.debug(`Display ${display.id} (Client ID ${display.clientId}) has been created`)
      if (this.socketServer.isDisplayPending(display.clientId)) {
        // Try to authenticate again.
        this.checkAuthentication(display.clientId)
      }
    })
  }

  onSocketConnected (clientId) {
    this.logger.debug(`Client ${clientId} wants to connect`)
    this.checkAuthentication(clientId)
  }

  checkAuthentication (clientId) {
    this.displayService.getDisplayByClientId(clientId)
      .then(display => {
        if (display.active) {
          this.socketServer.authenticateDisplay(clientId)
          this.socketServer.pushConfigToDisplay(clientId, {})
        } else {
          this.socketServer.deauthenticateDisplay(clientId, 'Display not active')
        }
      })
      .catch(() => {
        this.socketServer.deauthenticateDisplay(clientId, 'Display not active')
      })
  }
}

module.exports = SocketController
