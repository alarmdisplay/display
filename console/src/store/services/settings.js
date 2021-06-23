import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client'

class Setting extends BaseModel {
  static modelName = 'Setting'

  static instanceDefaults () {
    return {
      key: '',
      value: null
    }
  }
}

const servicePath = 'api/v1/settings'
const servicePlugin = makeServicePlugin({
  Model: Setting,
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
