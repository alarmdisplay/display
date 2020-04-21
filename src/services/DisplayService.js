const EventEmitter = require('events')

const IllegalArgumentError = require('../errors/IllegalArgumentError')

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

  getViewsForDisplay (displayId) {
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
      this.contentSlotRepository.getContentSlotsByViewId(viewId),
      this.componentService.getAllComponentsAsMap()
    ])
      .then(result => {
        return this.enrichViewWithComponents(result[0], result[1], result[2])
      })
  }

  /**
   * Adds the Components to the View, based on the configured Content Slots.
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
    return view
  }
}

module.exports = DisplayService
