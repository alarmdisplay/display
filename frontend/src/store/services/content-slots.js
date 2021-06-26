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
      rowEnd: 2
    }
  }

  static setupInstance(data, { models }) {
    // Add nested view objects to storage
    if (!data.options || !Array.isArray(data.options)) {
      data.options = []
    }
    data.options.forEach(option => new models.api.ContentSlotOption(option))

    // Replace the nested views with a getter
    Object.defineProperty(data, 'options', {
      get: function () {
        const options = models.api.ContentSlotOption.findInStore({
          query: {
            contentSlotId: data.id
          }
        })
        return options.data
      },
      configurable: true,
      enumerable: true
    })

    return data
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
