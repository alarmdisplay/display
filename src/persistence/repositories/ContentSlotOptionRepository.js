const NotFoundError = require('../../errors/NotFoundError')

class ContentSlotOptionRepository {
  constructor () {
    this.options = new Map()
  }

  /**
   * @param {Number} contentSlotId
   * @param {String} key
   * @param {String} value
   *
   * @return {Promise<Object>}
   */
  createOption (contentSlotId, key, value) {
    return new Promise((resolve, reject) => {
      if (!this.options.has(contentSlotId)) {
        this.options.set(contentSlotId, new Map())
      }

      const contentSlotOptions = this.options.get(contentSlotId)
      if (contentSlotOptions.has(key)) {
        reject(new Error(`Content Slot ${contentSlotId} already has an option for key ${key}`))
        return
      }
      contentSlotOptions.set(key, value)
      resolve({
        contentSlotId: contentSlotId,
        key: key,
        value: value
      })
    })
  }

  /**
   * @param {Number} contentSlotId
   * @param {String} key
   *
   * @return {Promise<String>}
   */
  getOption (contentSlotId, key) {
    return new Promise((resolve, reject) => {
      if (!this.options.has(contentSlotId)) {
        reject(new NotFoundError(`There is no ContentSlot with ID ${contentSlotId}`))
        return
      }

      const contentSlotOptions = this.options.get(contentSlotId)
      if (!contentSlotOptions.has(key)) {
        reject(new NotFoundError(`There is no option for Content Slot ${contentSlotId} and key ${key}`))
        return
      }
      resolve(String(contentSlotOptions.get(key)))
    })
  }

  /**
   * @param contentSlotId
   * @return {Promise<Map<String,String>>}
   */
  getOptionsForContentSlot (contentSlotId) {
    return new Promise(resolve => {
      if (!this.options.has(contentSlotId)) {
        resolve(new Map())
        return
      }

      const contentSlotOptions = this.options.get(contentSlotId)
      const allOptions = new Map()
      for (const [key, value] of contentSlotOptions.entries()) {
        allOptions.set(key, value)
      }
      resolve(allOptions)
    })
  }

  /**
   * @param {Number} contentSlotId
   * @param {String} key
   * @param {String} value
   *
   * @return {Promise<String>} The updated value
   */
  updateOption (contentSlotId, key, value) {
    return new Promise((resolve, reject) => {
      if (!this.options.has(contentSlotId)) {
        reject(new NotFoundError(`There is no Content Slot with ID ${contentSlotId}`))
        return
      }

      const contentSlotOptions = this.options.get(contentSlotId)
      if (!contentSlotOptions.has(key)) {
        reject(new NotFoundError(`There is no option for Content Slot ${contentSlotId} and key ${key}`))
        return
      }

      contentSlotOptions.set(key, value)
      resolve(String(contentSlotOptions.get(key)))
    })
  }

  /**
   * @param {Number} contentSlotId
   * @param {String} key
   *
   * @return {Promise}
   */
  deleteOption (contentSlotId, key) {
    return new Promise(resolve => {
      if (!this.options.has(contentSlotId)) {
        resolve()
        return
      }

      const contentSlotOptions = this.options.get(contentSlotId)
      contentSlotOptions.delete(key)
      resolve()
    })
  }

  /**
   * @param {Number} contentSlotId
   *
   * @return {Promise}
   */
  deleteOptionsForContentSlot (contentSlotId) {
    return new Promise(resolve => {
      if (!this.options.has(contentSlotId)) {
        resolve()
        return
      }

      this.options.delete(contentSlotId)
      resolve()
    })
  }
}

module.exports = ContentSlotOptionRepository
