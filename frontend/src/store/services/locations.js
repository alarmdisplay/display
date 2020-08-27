import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client'

class Location extends BaseModel {
  constructor(data, options) {
    super(data, options)
  }

  static modelName = 'Location'

  static instanceDefaults() {
    return {
      rawText: '',
      latitude: undefined,
      longitude: undefined,
      name: '',
      street: '',
      number: '',
      detail: '',
      locality: '',
      incidentId: undefined
    }
  }
}

const servicePath = 'api/v1/locations'
const servicePlugin = makeServicePlugin({
  Model: Location,
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
