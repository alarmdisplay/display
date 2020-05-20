const log4js = require('log4js')

class SocketController {
  /**
   * @param {SocketServer} socketServer
   * @param {DisplayService} displayService
   * @param {ContentService} contentService
   * @param {AlertService} alertService
   */
  constructor (socketServer, displayService, contentService, alertService) {
    this.socketServer = socketServer
    this.displayService = displayService
    this.contentService = contentService
    this.alertService = alertService
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
    this.contentService.on('content_changed', contentType => {
      this.logger.debug(`Content for content type '${contentType}' changed`)
      this.contentService.getComponentTypesForContentType(contentType)
        .then(componentTypes => Promise.all(componentTypes.map(componentType => this.displayService.getContentSlotsForComponentType(componentType))))
        .then(result => {
          const viewIds = new Set()
          result.forEach(contentSlots => {
            contentSlots.forEach(contentSlot => {
              viewIds.add(contentSlot.viewId)
            })
          })
          const viewIdsToRefresh = Array.from(viewIds.values())
          this.logger.debug('The content of the following Views needs to be refreshed:', viewIdsToRefresh)
          return viewIdsToRefresh
        })
        .then(viewIds => this.displayService.getDisplaysForViews(viewIds))
        .then(displays => {
          this.logger.debug('The following Displays will receive a content update:', displays.map(display => display.id))
          return displays
        })
        .then(displays => Promise.all(displays.map(display => this.pushContentToDisplay(display))))
        .catch(reason => this.logger.error(reason))
    })
    this.alertService.on('alert_created', alert => {
      this.socketServer.addAlert(alert)
    })
    this.alertService.on('alert_removed', alertId => {
      this.socketServer.removeAlert(alertId)
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
        return Promise.reject(reason)
      })
  }

  /**
   * @param {Object} display
   *
   * @return {Promise<Object>}
   */
  pushConfigToDisplay (display) {
    this.logger.debug(`Pushing config to Display '${display.name}'`)
    return this.displayService.getViewsForDisplay(display.id)
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
    return this.displayService.getViewsForDisplay(display.id)
      .then(views => {
        const contentSlots = new Set()
        for (const view of views) {
          view.contentSlots.forEach(contentSlot => contentSlots.add(contentSlot))
        }
        return Array.from(contentSlots.values())
      })
      .then(contentSlots => this.contentService.getContentForContentSlots(contentSlots))
      .then(content => {
        this.socketServer.pushContentToDisplay(display.clientId, content)
      })
  }
}

module.exports = SocketController
