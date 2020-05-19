const log4js = require('log4js')

const EventEmitter = require('events')

class DisplayService extends EventEmitter {
  /**
   * @param {DisplayRepository} displayRepository
   * @param {ViewRepository} viewRepository
   * @param {ContentSlotRepository} contentSlotRepository
   * @param {ComponentService} componentService
   */
  constructor (displayRepository, viewRepository, contentSlotRepository, componentService) {
    super()
    this.displayRepository = displayRepository
    this.viewRepository = viewRepository
    this.contentSlotRepository = contentSlotRepository
    this.componentService = componentService
    this.logger = log4js.getLogger('DisplayService')
  }

  createDisplay (name, active, clientId, description = '', location = '') {
    return this.displayRepository.createDisplay(name, active, clientId, description, location)
      .then(newDisplay => {
        this.emit('display_created', newDisplay)
        return newDisplay
      })
  }

  getAllDisplays () {
    return this.displayRepository.getAllDisplays()
  }

  getDisplayById (displayId) {
    return this.displayRepository.getDisplayById(displayId)
  }

  getDisplayByClientId (clientId) {
    return this.displayRepository.getDisplayByClientId(clientId)
  }

  /**
   * @param {Number} componentId
   *
   * @return {Promise<Object[]>}
   */
  getDisplaysContainingComponent (componentId) {
    return this.contentSlotRepository.getContentSlotsByComponentId(componentId)
      .then(contentSlots => contentSlots.map(contentSlot => contentSlot.viewId))
      .then(viewIds => this.viewRepository.getViewsById(viewIds))
      .then(views => views.map(view => view.displayId))
      .then(displayIds => this.displayRepository.getDisplaysById(displayIds))
  }

  deleteDisplay (displayId) {
    return this.displayRepository.deleteDisplay(displayId)
      .then(displayId => {
        if (displayId) {
          this.emit('display_deleted', displayId)
        }

        return displayId
      })
  }

  updateDisplay (displayId, name, active, clientId, description, location) {
    return this.displayRepository.updateDisplay(displayId, name, active, clientId, description, location)
      .then(updatedDisplay => {
        this.emit('display_updated', updatedDisplay)
        return updatedDisplay
      })
  }

  /**
   * Creates a new View for a Display and appends it as the last View for that screen type.
   *
   * @param {String} name
   * @param {Number} columns
   * @param {Number} rows
   * @param {Number} displayId
   * @param {String} screenType
   *
   * @return {Promise}
   */
  createView (name, columns, rows, displayId, screenType) {
    return this.viewRepository.getViewsByDisplayIdAndScreenType(displayId, screenType)
      .then(views => {
        return this.viewRepository.createView(name, columns, rows, displayId, views.length + 1, screenType)
      })
  }

  /**
   * Returns the Views and their Content Slots for a specific Display.
   *
   * @param {Number} displayId The ID of the Display
   *
   * @return {Promise<Object[]>}
   */
  getViewsForDisplay (displayId) {
    return this.viewRepository.getViewsByDisplayId(displayId)
      .then(async views => {
        const enrichedViews = []
        for (const view of views) {
          view.contentSlots = await this.contentSlotRepository.getContentSlotsByViewId(view.id)
          enrichedViews.push(view)
        }

        return enrichedViews
      })
  }

  /**
   * @param {Number} viewId
   * @return {Promise}
   */
  getView (viewId) {
    return Promise.all([
      this.viewRepository.getViewById(viewId),
      this.contentSlotRepository.getContentSlotsByViewId(viewId)
    ])
      .then(([view, contentSlots]) => {
        view.contentSlots = contentSlots
        return view
      })
  }

  getComponentsForDisplay (displayId) {
    return this.getViewsForDisplay(displayId)
      .then(async views => {
        const componentIds = new Set()
        for (const view of views) {
          const contentSlots = await this.contentSlotRepository.getContentSlotsByViewId(view.id)
          contentSlots.forEach(contentSlot => componentIds.add(contentSlot.componentId))
        }
        return this.componentService.getComponents(Array.from(componentIds.values()))
      })
  }

  /**
   * @param {Number} viewId
   *
   * @return {Promise}
   */
  deleteView (viewId) {
    return this.getView(viewId)
      .then(view => this.getDisplayById(view.displayId))
      .then(display => {
        return this.viewRepository.deleteView(viewId)
          .then(() => this.emit('views_updated', display))
          .catch(error => {
            // We don't really handle this error as it only affects the internal event, but not the update function
            this.logger.error(error)
          })
      })
  }

  /**
   * @param {Number} id
   * @param {String} name
   * @param {Number} columns
   * @param {Number} rows
   * @param {Object[]} contentSlots
   *
   * @return {Promise<Object>}
   */
  updateView (id, name, columns, rows, contentSlots) {
    return this.viewRepository.getViewById(id)
      .then(view => this.viewRepository.updateView(view.id, name, columns, rows, view.displayId, view.order, view.screenType))
      .then(updatedView => this.updateContentSlotsForView(updatedView.id, contentSlots))
      .then(() => {
        return this.getView(id)
          .then(updatedView => {
            this.getDisplayById(updatedView.displayId)
              .then(display => this.emit('views_updated', display))
              .catch(error => {
                // We don't really handle this error as it only affects the internal event, but not the update function
                this.logger.error(error)
              })

            return updatedView
          })
      })
  }

  updateContentSlotsForView (viewId, newContentSlots) {
    return this.contentSlotRepository.getContentSlotsByViewId(viewId)
      .then(async existingContentSlots => {
        const existingContentSlotIds = existingContentSlots.map(contentSlot => contentSlot.id)
        this.logger.debug('Existing components', existingContentSlotIds)
        const submittedContentSlotIds = newContentSlots.filter(contentSlot => contentSlot.id !== undefined).map(contentSlot => contentSlot.id)
        const removedComponents = existingContentSlotIds.filter(id => !submittedContentSlotIds.includes(id))
        this.logger.debug('Removed components', removedComponents)

        try {
          for (const contentSlotId of removedComponents) {
            this.logger.debug(`Deleting Content Slot for View ${viewId}, Content Slot ID ${contentSlotId}`)
            await this.contentSlotRepository.deleteContentSlot(contentSlotId)
          }

          for (const contentSlot of newContentSlots) {
            if (contentSlot.id === undefined) {
              // Add a new Content Slot for this component
              this.logger.debug(`Adding Content Slot for View ${viewId}, Component ${contentSlot.componentType}`)
              await this.contentSlotRepository.createContentSlot(contentSlot.componentType, viewId, contentSlot.columnStart, contentSlot.rowStart, contentSlot.columnEnd, contentSlot.rowEnd)
              continue
            }

            // Update an existing Content Slot
            this.logger.debug(`Updating Content Slot for View ${viewId}, Content Slot ID ${contentSlot.id}`)
            const existingContentSlot = await this.contentSlotRepository.getContentSlot(contentSlot.id)
            await this.contentSlotRepository.updateContentSlot(existingContentSlot.id, contentSlot.componentType, viewId, contentSlot.columnStart, contentSlot.rowStart, contentSlot.columnEnd, contentSlot.rowEnd)
          }
        } catch (e) {
          return Promise.reject(e)
        }

        return Promise.resolve()
      })
  }
}

module.exports = DisplayService
