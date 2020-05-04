const log4js = require('log4js')

class SocketController {
  /**
   * @param {SocketServer} socketServer
   * @param {DisplayService} displayService
   * @param {ComponentService} componentService
   * @param {ContentService} contentService
   */
  constructor (socketServer, displayService, componentService, contentService) {
    this.socketServer = socketServer
    this.displayService = displayService
    this.componentService = componentService
    this.contentService = contentService
    this.logger = log4js.getLogger('SocketController')
  }

  registerListeners () {
    this.socketServer.on('socket_connected', socketId => this.onSocketConnected(socketId))
    this.displayService.on('display_created', display => {
      this.logger.debug(`Display ${display.id} (Client ID ${display.clientId}) has been created`)
      if (this.socketServer.isDisplayPending(display.clientId)) {
        // Try to authenticate again.
        this.checkAuthentication(display.clientId)
          .then(display => this.pushConfigToDisplay(display))
          .then(display => this.pushContentToDisplay(display))
          .catch(reason => this.logger.error(reason))
      }
    })
    this.displayService.on('display_updated', display => {
      this.logger.debug(`Display ${display.id} has been updated`)
      this.checkAuthentication(display.clientId)
        .then(display => this.pushConfigToDisplay(display))
        .then(display => this.pushContentToDisplay(display))
        .catch(reason => this.logger.error(reason))
    })
    this.displayService.on('display_deleted', displayId => {
      this.logger.debug(`Display ${displayId} has been deleted`)
      // TODO deauthenticate Display
    })
    this.displayService.on('views_updated', display => {
      this.logger.debug(`Views for Display ${display.id} have been updated`)
      this.pushConfigToDisplay(display)
        .then(display => this.pushContentToDisplay(display))
        .catch(reason => this.logger.error(reason))
    })
    this.componentService.on('component_updated', componentId => {
      this.logger.debug(`Component ${componentId} has been updated`)
      this.displayService.getDisplaysContainingComponent(componentId)
        .then(async displays => {
          for (const display of displays) {
            try {
              await this.pushConfigToDisplay(display)
              await this.pushContentToDisplay(display)
            } catch (e) {
              this.logger.error(e)
            }
          }
        })
    })
    this.contentService.on('component_content_updated', componentId => {
      this.logger.debug(`Content for Component ${componentId} has been updated`)
      this.displayService.getDisplaysContainingComponent(componentId)
        .then(displays => Promise.all(displays.map(display => this.pushContentToDisplay(display))))
        .catch(reason => this.logger.error(reason))
    })
  }

  onSocketConnected (clientId) {
    this.logger.debug(`Client ${clientId} wants to connect`)
    this.checkAuthentication(clientId)
      .then(display => this.pushConfigToDisplay(display))
      .then(display => this.pushContentToDisplay(display))
      .catch(reason => this.logger.error(reason))
  }

  /**
   * @param {String} clientId
   *
   * @return {Promise}
   */
  checkAuthentication (clientId) {
    return this.displayService.getDisplayByClientId(clientId)
      .then(display => {
        if (!display.active) {
          throw new Error('Display not active')
        }

        this.socketServer.authenticateDisplay(clientId)
        return display
      })
      .catch(reason => {
        const message = (reason instanceof Error) ? reason.message : reason
        this.socketServer.deauthenticateDisplay(clientId, message)
      })
  }

  /**
   * @param {Object} display
   *
   * @return {Promise<Object>}
   */
  pushConfigToDisplay (display) {
    this.logger.debug(`Pushing config to Display '${display.name}'`)
    return this.displayService.getViewsForDisplayWithComponents(display.id)
      .then(views => {
        this.socketServer.pushConfigToDisplay(display.clientId, {
          views: views
        })
        return display
      })
  }

  /**
   * @param {Object} display
   *
   * @return {Promise}
   */
  pushContentToDisplay (display) {
    this.logger.debug(`Pushing content to Display '${display.name}'`)
    return this.displayService.getComponentsForDisplay(display.id)
      .then(components => this.contentService.getContentForComponents(components))
      .then(content => {
        this.socketServer.pushContentToDisplay(display.clientId, content)
      })
  }
}

module.exports = SocketController
