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

  getViewsForDisplayWithComponents (displayId) {
    return Promise.all([
      this.viewRepository.getViewsByDisplayId(displayId),
      this.componentService.getAllComponentsAsMap()
    ])
      .then(async result => {
        const views = result[0]
        const allComponents = result[1]

        const enrichedViews = []
        for (const view of views) {
          const contentSlots = await this.contentSlotRepository.getContentSlotsByViewId(view.id)
          enrichedViews.push(this.enrichViewWithComponents(view, contentSlots, allComponents))
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

  /**
   * @param {Number} viewId
   * @return {Promise}
   */
  getViewWithComponents (viewId) {
    return Promise.all([
      this.viewRepository.getViewById(viewId),
      this.contentSlotRepository.getContentSlotsByViewId(viewId),
      this.componentService.getAllComponentsAsMap()
    ])
      .then(result => {
        return this.enrichViewWithComponents(result[0], result[1], result[2])
      })
  }

  /**
   * Resolves the configured Content Slots to the respective components. This format is required by the Displays.
   *
   * @param {Object} view
   * @param {Object[]} contentSlots
   * @param {Map<Number, Object>} allComponents
   *
   * @return {Object}
   */
  enrichViewWithComponents (view, contentSlots, allComponents) {
    const components = []
    for (const contentSlot of contentSlots) {
      const component = allComponents.get(contentSlot.componentId)

      // Skip components that don't seem to exist
      if (!component) {
        continue
      }

      components.push({
        name: component.type,
        instanceId: contentSlot.componentId,
        columnStart: contentSlot.columnStart,
        rowStart: contentSlot.rowStart,
        columnEnd: contentSlot.columnEnd,
        rowEnd: contentSlot.rowEnd
      })
    }

    view.components = components
    delete view.contentSlots
    return view
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
            console.error(error)
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
                console.error(error)
              })

            return updatedView
          })
      })
  }

  updateContentSlotsForView (viewId, newContentSlots) {
    return this.contentSlotRepository.getContentSlotsByViewId(viewId)
      .then(async existingContentSlots => {
        const existingComponents = existingContentSlots.map(contentSlot => contentSlot.componentId)
        const newComponents = newContentSlots.map(contentSlot => contentSlot.componentId)
        console.log('Existing components', existingComponents)
        console.log('New components', newComponents)
        const removedComponents = existingComponents.filter(componentId => !newComponents.includes(componentId))
        const addedComponents = newComponents.filter(componentId => !existingComponents.includes(componentId))
        console.log('Removed components', removedComponents)
        console.log('Added components', addedComponents)

        try {
          for (const componentId of removedComponents) {
            console.log(`Deleting Content Slot for View ${viewId}, Component ${componentId}`)
            const contentSlot = await this.contentSlotRepository.getContentSlotForComponentAndView(viewId, componentId)
            await this.contentSlotRepository.deleteContentSlot(contentSlot.id)
          }

          for (const contentSlot of newContentSlots) {
            if (addedComponents.includes(contentSlot.componentId)) {
              // Add a new Content Slot for this component
              console.log(`Adding Content Slot for View ${viewId}, Component ${contentSlot.componentId}`)
              await this.contentSlotRepository.createContentSlot(contentSlot.componentId, viewId, contentSlot.columnStart, contentSlot.rowStart, contentSlot.columnEnd, contentSlot.rowEnd)
              continue
            }

            // Update an existing Content Slot
            console.log(`Updating Content Slot for View ${viewId}, Component ${contentSlot.componentId}`)
            const existingContentSlot = await this.contentSlotRepository.getContentSlotForComponentAndView(viewId, contentSlot.componentId)
            await this.contentSlotRepository.updateContentSlot(existingContentSlot.id, contentSlot.componentId, viewId, contentSlot.columnStart, contentSlot.rowStart, contentSlot.columnEnd, contentSlot.rowEnd)
          }
        } catch (e) {
          return Promise.reject(e)
        }

        return Promise.resolve()
      })
  }
}

module.exports = DisplayService
