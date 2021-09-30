import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client'

class Display extends BaseModel {
  static modelName = 'Display'

  static instanceDefaults () {
    return {
      name: '',
      active: false,
      description: ''
    }
  }

  static setupInstance (data, { models }) {
    // Add nested view objects to storage
    if (data.views && Array.isArray(data.views)) {
      data.views.forEach(view => new models.api.View(view))
    }

    // Replace the nested views with a getter
    Object.defineProperty(data, 'views', {
      get: function () {
        const views = models.api.View.findInStore({
          query: {
            displayId: data.id,
            $sort: {
              order: 1
            }
          }
        })
        return views.data
      },
      configurable: true,
      enumerable: true
    })

    return data
  }
}

const servicePath = 'api/v1/displays'
const servicePlugin = makeServicePlugin({
  Model: Display,
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
    get: [setOwnDisplayId],
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

function setOwnDisplayId (context) {
  if (context.id === 'self') {
    console.log('Own Display ID is', context.result.id)
    context.service.FeathersVuexModel.store.commit('setOwnDisplayId', context.result.id)
  }
}

export default servicePlugin
