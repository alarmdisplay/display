import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client'

class CalendarItem extends BaseModel {
  constructor(data, options) {
    super(data, options)
  }

  static modelName = 'CalendarItem'

  static instanceDefaults() {
    return {
      uid: '',
      summary: '',
      startDate: null,
      endDate: null,
      description: '',
      status: 'confirmed',
      allDayEvent: false,
      feedId: 0,
    }
  }

  static setupInstance(data) {
    // Convert date strings into Date objects
    for (const prop of ['startDate', 'endDate']) {
      if (data[prop]) {
        data[prop] = new Date(data[prop])
      }
    }

    return data
  }
}

const servicePath = 'calendar-items'
const servicePlugin = makeServicePlugin({
  Model: CalendarItem,
  idField: 'uid',
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
