import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client'

class Announcement extends BaseModel {
  constructor(data, options) {
    super(data, options)
  }

  static modelName = 'Announcement'

  static instanceDefaults() {
    return {
      title: '',
      body: '',
      important: false,
      validFrom: null,
      validTo: null
    }
  }

  static setupInstance(data) {
    // Convert date strings into Date objects
    for (const prop of ['validFrom', 'validTo', 'updatedAt']) {
      if (data[prop]) {
        data[prop] = new Date(data[prop])
      }
    }

    return data
  }
}

const servicePath = 'api/v1/announcements'
const servicePlugin = makeServicePlugin({
  Model: Announcement,
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
