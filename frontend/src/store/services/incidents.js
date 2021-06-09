import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client'

class Incident extends BaseModel {
  constructor(data, options) {
    super(data, options)
  }

  static modelName = 'Incident'

  static instanceDefaults() {
    return {
      time: new Date(),
      sender: '',
      ref: '',
      caller_name: '',
      caller_number: '',
      reason: '',
      keyword: '',
      description: '',
      status: 'Actual',
      category: 'Other'
    }
  }

  static setupInstance(data, { models }) {
    // Convert date strings into Date objects
    for (const prop of ['time']) {
      if (data[prop]) {
        data[prop] = new Date(data[prop])
      }
    }

    // Add nested location object to storage
    if (data.location) {
      new models.api.Location(data.location)
    }

    // Replace the nested location with a getter
    Object.defineProperty(data, 'location', {
      get: function () {
        let locations = models.api.Location.findInStore({
          query: {
            incidentId: data.id,
            $sort: {
              updatedAt: -1
            },
            $limit: 1
          }
        })
        return locations.data.length ? locations.data[0] : undefined
      },
      configurable: true,
      enumerable: true
    })

    return data
  }
}

const servicePath = 'api/v1/incidents'
const servicePlugin = makeServicePlugin({
  Model: Incident,
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
