import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client'

class View extends BaseModel {
  constructor(data, options) {
    super(data, options)
  }

  static modelName = 'View'

  static instanceDefaults() {
    return {
      type: 'idle',
      order: 999,
      columns: 3,
      rows: 3,
      contentSlots: []
    }
  }

  static setupInstance(data, { models }) {
    if (data.contentSlots && Array.isArray(data.contentSlots)) {
      data.contentSlots = data.contentSlots.map(contentSlot => new models.api.ContentSlot(contentSlot))
    }

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
