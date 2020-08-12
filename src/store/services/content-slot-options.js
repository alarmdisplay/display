import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client'

class ContentSlotOption extends BaseModel {
  constructor(data, options) {
    super(data, options)
  }

  static modelName = 'ContentSlotOption'

  static instanceDefaults() {
    return {
      key: '',
      value: '',
      contentSlotId: undefined
    }
  }
}

const servicePath = 'api/v1/content-slot-options'
const servicePlugin = makeServicePlugin({
  Model: ContentSlotOption,
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
