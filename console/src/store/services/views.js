import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client'

class View extends BaseModel {
  static modelName = 'View'

  static instanceDefaults () {
    return {
      type: 'idle',
      order: 999,
      columns: 3,
      rows: 3,
      displayId: null
    }
  }

  static setupInstance (data, { models }) {
    // Add nested content slot objects to storage
    if (data.contentSlots && Array.isArray(data.contentSlots)) {
      data.contentSlots.forEach(contentSlot => new models.api.ContentSlot(contentSlot))
    }

    // Replace the nested content slots with a getter
    Object.defineProperty(data, 'contentSlots', {
      get: function () {
        const contentSlots = models.api.ContentSlot.findInStore({
          query: {
            viewId: data.id
          }
        })
        return contentSlots.data
      },
      configurable: true,
      enumerable: true
    })

    return data
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
