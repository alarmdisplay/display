import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client'

class View extends BaseModel {
  static modelName = 'View'

  static instanceDefaults () {
    return {
      type: 'idle',
      order: 999,
      columns: 3,
      rows: 3,
      contentSlots: []
    }
  }

  static setupInstance (data, { models }) {
    if (data.contentSlots && Array.isArray(data.contentSlots)) {
      console.log('setup view', data)
      data.contentSlots = data.contentSlots.map(contentSlot => new models.api.ContentSlot(contentSlot))
    }

    return data
  }

  async save (params) {
    console.log('save me!', this)
    const savedView = await super.save(params)
    console.log('view saved', savedView, this)

    const contentSlotIdsToSave = this.contentSlots.filter(contentSlot => contentSlot.id !== undefined).map(contentSlot => contentSlot.id)
    console.log('saving slots', contentSlotIdsToSave)

    const removedContentSlots = savedView.contentSlots.filter(contentSlot => {
      if (contentSlot.__id) {
        return false
      }

      return !contentSlotIdsToSave.includes(contentSlot.id)
    })
    for (const contentSlot of removedContentSlots) {
      await contentSlot.remove()
    }

    // Save the remaining content slots
    for (const contentSlot of this.contentSlots) {
      console.log('saving slot', contentSlot)
      await contentSlot.save()
    }

    return savedView
  }
}

const servicePath = 'api/v1/views'
const servicePlugin = makeServicePlugin({
  Model: View,
  service: feathersClient.service(servicePath),
  servicePath
})

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
})

export default servicePlugin
