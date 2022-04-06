import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client'

class CalendarFeed extends BaseModel {
  static modelName = 'CalendarFeed'

  static instanceDefaults () {
    return {
      name: '',
      url: '',
    }
  }

  static setupInstance (data) {
    // Convert date strings into Date objects
    for (const prop of ['createdAt', 'updatedAt']) {
      if (data[prop]) {
        data[prop] = new Date(data[prop])
      }
    }

    return data
  }
}

const servicePath = 'calendar-feeds'
const servicePlugin = makeServicePlugin({
  Model: CalendarFeed,
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
