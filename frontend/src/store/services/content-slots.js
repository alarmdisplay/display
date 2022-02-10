import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client'

class ContentSlot extends BaseModel {
  constructor(data, options) {
    super(data, options)
  }

  static modelName = 'ContentSlot'

  static instanceDefaults() {
    return {
      component: 'Clock',
      columnStart: 1,
      columnEnd: 1,
      rowStart: 2,
      rowEnd: 2,
      options: {}
    }
  }
}

const servicePath = 'api/v1/content-slots'
const servicePlugin = makeServicePlugin({
  Model: ContentSlot,
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
