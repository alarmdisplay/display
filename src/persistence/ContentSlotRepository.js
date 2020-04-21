class ContentSlotRepository {
  constructor () {
    this.contentSlots = new Map()
    this.instanceCounter = 1
  }

  /**
   * @param {Number} componentId
   * @param {Number} viewId
   * @param {Number} columnStart
   * @param {Number} rowStart
   * @param {Number} columnEnd
   * @param {Number} rowEnd
   *
   * @return {Promise}
   */
  createContentSlot (componentId, viewId, columnStart, rowStart, columnEnd, rowEnd) {
    return new Promise(resolve => {
      const newContentSlot = {
        id: this.instanceCounter++,
        componentId: componentId,
        viewId: viewId,
        columnStart: columnStart,
        rowStart: rowStart,
        columnEnd: columnEnd,
        rowEnd: rowEnd
      }
      this.contentSlots.set(newContentSlot.id, newContentSlot)
      resolve(newContentSlot)
    })
  }

  /**
   * @return {Promise}
   */
  getAllContentSlots () {
    return new Promise(resolve => {
      const contentSlots = Array.from(this.contentSlots.values())
      resolve(contentSlots)
    })
  }

  /**
   * @param {Number} id
   *
   * @return {Promise}
   */
  getContentSlot (id) {
    return new Promise((resolve, reject) => {
      if (!this.contentSlots.has(id)) {
        return reject(new Error(`No Content Slot with ID ${id} found`))
      }

      resolve(this.contentSlots.get(id))
    })
  }

  /**
   * Finds and returns Content Slot objects that belong to a certain View.
   *
   * @param {Number} viewId The ID of the View
   *
   * @return {Promise<Object[]>}
   */
  getContentSlotsByViewId (viewId) {
    return new Promise((resolve) => {
      const contentSlots = []
      for (const contentSlot of this.contentSlots.values()) {
        if (contentSlot.viewId === viewId) {
          contentSlots.push(contentSlot)
        }
      }

      resolve(contentSlots)
    })
  }

  /**
   * Deletes a Content Slot object.
   *
   * @param {Number} id The ID of the Content Slot
   *
   * @return {Promise}
   */
  deleteContentSlot (id) {
    return new Promise(resolve => {
      const itemDidExist = this.contentSlots.delete(id)
      if (itemDidExist) {
        resolve(id)
      } else {
        resolve(undefined)
      }
    })
  }

  /**
   * @param {Number} id
   * @param {Number} componentId
   * @param {Number} viewId
   * @param {Number} columnStart
   * @param {Number} rowStart
   * @param {Number} columnEnd
   * @param {Number} rowEnd
   *
   * @return {Promise}
   */
  updateContentSlot (id, componentId, viewId, columnStart, rowStart, columnEnd, rowEnd) {
    return new Promise((resolve, reject) => {
      if (!this.contentSlots.has(id)) {
        return reject(new Error(`No Content Slot with ID ${id} found`))
      }

      const contentSlot = {
        id: id,
        componentId: componentId,
        viewId: viewId,
        columnStart: columnStart,
        rowStart: rowStart,
        columnEnd: columnEnd,
        rowEnd: rowEnd
      }
      this.contentSlots.set(id, contentSlot)
      resolve(contentSlot)
    })
  }
}

module.exports = ContentSlotRepository
