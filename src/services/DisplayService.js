const EventEmitter = require('events')
const log4js = require('log4js')

class DisplayService extends EventEmitter {
  /**
   * @param {DisplayRepository} displayRepository
   * @param {ViewRepository} viewRepository
   * @param {ContentSlotRepository} contentSlotRepository
   */
  constructor (displayRepository, viewRepository, contentSlotRepository) {
    super()
    this.displayRepository = displayRepository
    this.viewRepository = viewRepository
    this.contentSlotRepository = contentSlotRepository
    this.logger = log4js.getLogger('DisplayService')
  }

  async createDisplay (name, active, clientId, description = '', location = '') {
    const id = await this.displayRepository.createDisplay(name, active, clientId, description, location)
    const newDisplay = await this.getDisplayById(id)
    this.emit('display_created', newDisplay)
    return newDisplay
  }

  async getAllDisplays () {
    return this.displayRepository.getAll()
  }

  async getDisplayById (displayId) {
    return this.displayRepository.getDisplayById(displayId)
  }

  async getDisplayByClientId (clientId) {
    return this.displayRepository.getDisplayByClientId(clientId)
  }

  getDisplaysForViews (viewIds) {
    return this.viewRepository.getViewsById(viewIds)
      .then(views => views.map(view => view.displayId))
      .then(displayIds => this.displayRepository.getDisplaysById(displayIds))
  }

  async deleteDisplay (displayId) {
    const result = await this.displayRepository.deleteOne(displayId)
    if (result) {
      this.emit('display_deleted', result)
    }

    return result
  }

  async updateDisplay (displayId, name, active, clientId, description, location) {
    const id = await this.displayRepository.updateDisplay(displayId, name, active, clientId, description, location)
    if (!id) {
      return this.getDisplayById(displayId)
    }

    const updatedDisplay = await this.getDisplayById(id)
    this.emit('display_updated', updatedDisplay)
    return updatedDisplay
  }

  /**
   * Creates a new View for a Display and appends it as the last View for that screen type.
   *
   * @param {Number} displayId
   * @param {String} screenType
   * @param {Number} columns
   * @param {Number} rows
   *
   * @return {Promise<Object>}
   */
  async createView (displayId, screenType, columns, rows) {
    const existingViews = await this.viewRepository.getViewsByDisplayIdAndScreenType(displayId, screenType)
    const viewId = await this.viewRepository.create(displayId, existingViews.length + 1, screenType, columns, rows)
    return this.viewRepository.getViewById(viewId)
  }

  /**
   * Returns the Views and their Content Slots for a specific Display.
   *
   * @param {Number} displayId The ID of the Display
   *
   * @return {Promise<Object[]>}
   */
  async getViewsForDisplay (displayId) {
    const views = await this.viewRepository.getViewsByDisplayId(displayId)
    const enrichedViews = []
    for (const view of views) {
      view.contentSlots = await this.contentSlotRepository.getContentSlotsByViewId(view.id)
      enrichedViews.push(view)
    }

    return enrichedViews
  }

  /**
   * @param {Number} viewId
   *
   * @return {Promise<Object>|Promise<null>}
   */
  async getView (viewId) {
    const view = await this.viewRepository.getViewById(viewId)
    if (!view) {
      return null
    }
    view.contentSlots = await this.contentSlotRepository.getContentSlotsByViewId(viewId)
    return view
  }

  /**
   * @param {String} componentType
   *
   * @return {Promise<Object[]>}
   */
  getContentSlotsForComponentType (componentType) {
    return this.contentSlotRepository.getContentSlotsByComponentType(componentType)
  }

  /**
   * @param {Number} viewId
   *
   * @return {Promise}
   */
  async deleteView (viewId) {
    const view = await this.getView(viewId)
    if (!view) {
      return
    }

    await this.viewRepository.deleteOne(viewId)
    try {
      const display = await this.getDisplayById(view.displayId)
      this.emit('views_updated', display)
    } catch (e) {
      // We don't really handle this error as it only affects the internal event, but not the delete function
      this.logger.error(e)
    }
  }

  /**
   * @param {Number} id
   * @param {Number} columns
   * @param {Number} rows
   * @param {Object[]} contentSlots
   *
   * @return {Promise<Object>}
   */
  async updateView (id, columns, rows, contentSlots) {
    const view = await this.viewRepository.getViewById(id)
    if (!view) {
      throw new Error(`Trying to update a View that does not exist, View ID ${id}`)
    }

    await this.viewRepository.update(id, view.displayId, view.order, view.screenType, columns, rows)
    await this.updateContentSlotsForView(id, contentSlots)
    const updatedView = await this.getView(id)

    try {
      const display = await this.getDisplayById(updatedView.displayId)
      this.emit('views_updated', display)
    } catch (e) {
      // We don't really handle this error as it only affects the internal event, but not the update function
      this.logger.error(e)
    }

    return updatedView
  }

  updateContentSlotsForView (viewId, newContentSlots) {
    return this.contentSlotRepository.getContentSlotsByViewId(viewId)
      .then(async existingContentSlots => {
        const existingContentSlotIds = existingContentSlots.map(contentSlot => contentSlot.id)
        const submittedContentSlotIds = newContentSlots.filter(contentSlot => contentSlot.id !== undefined).map(contentSlot => contentSlot.id)
        const removedComponents = existingContentSlotIds.filter(id => !submittedContentSlotIds.includes(id))

        try {
          for (const contentSlotId of removedComponents) {
            await this.contentSlotRepository.deleteOne(contentSlotId)
          }

          for (const contentSlot of newContentSlots) {
            if (contentSlot.id === undefined) {
              // Add a new Content Slot for this component
              await this.contentSlotRepository.createContentSlot(contentSlot.componentType, viewId, contentSlot.columnStart, contentSlot.rowStart, contentSlot.columnEnd, contentSlot.rowEnd, contentSlot.options || {})
              continue
            }

            // Update an existing Content Slot
            await this.contentSlotRepository.updateContentSlot(contentSlot.id, contentSlot.componentType, viewId, contentSlot.columnStart, contentSlot.rowStart, contentSlot.columnEnd, contentSlot.rowEnd, contentSlot.options || {})
          }
        } catch (e) {
          return Promise.reject(e)
        }

        return Promise.resolve()
      })
  }
}

module.exports = DisplayService
