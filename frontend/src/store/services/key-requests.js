import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client'

class KeyRequest extends BaseModel {
  static modelName = 'KeyRequest'

  static instanceDefaults () {
    return {
      requestId: '',
      name: '',
      granted: false,
      apiKey: ''
    }
  }
}

const servicePath = 'api/v1/key-requests'
const servicePlugin = makeServicePlugin({
  Model: KeyRequest,
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
