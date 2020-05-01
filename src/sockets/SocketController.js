const log4js = require('log4js')

class SocketController {
  /**
   * @param {SocketServer} socketServer
   * @param {DisplayService} displayService
   * @param {ComponentService} componentService
   */
  constructor (socketServer, displayService, componentService) {
    this.socketServer = socketServer
    this.displayService = displayService
    this.componentService = componentService
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
    this.displayService.on('display_updated', display => {
      this.logger.debug(`Display ${display.id} has been updated`)
      this.checkAuthentication(display.clientId)
    })
    this.displayService.on('display_deleted', displayId => {
      this.logger.debug(`Display ${displayId} has been deleted`)
      // TODO deauthenticate Display
    })
    this.displayService.on('views_updated', display => {
      this.logger.debug(`Views for Display ${display.id} have been updated`)
      return this.pushConfigToDisplay(display)
    })
    this.componentService.on('component_updated', componentId => {
      this.logger.debug(`Component ${componentId} has been updated`)
      this.displayService.getDisplaysContainingComponent(componentId)
        .then(async displays => {
          for (const display of displays) {
            await this.pushConfigToDisplay(display)
          }
        })
    })
  }

  onSocketConnected (clientId) {
    this.logger.debug(`Client ${clientId} wants to connect`)
    this.checkAuthentication(clientId)
  }

  checkAuthentication (clientId) {
    this.displayService.getDisplayByClientId(clientId)
      .then(display => {
        if (!display.active) {
          throw new Error('Display not active')
        }

        this.socketServer.authenticateDisplay(clientId)
        return this.pushConfigToDisplay(display)
      })
      .catch(reason => {
        const message = (reason instanceof Error) ? reason.message : reason
        this.socketServer.deauthenticateDisplay(clientId, message)
      })
  }

  /**
   * @param {Object} display
   *
   * @return {Promise}
   */
  pushConfigToDisplay (display) {
    this.logger.debug(`Pushing config to Display '${display.name}'`)
    return this.displayService.getViewsForDisplayWithComponents(display.id)
      .then(views => {
        this.socketServer.pushConfigToDisplay(display.clientId, {
          views: views
        })
      })
  }
}

module.exports = SocketController
