import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client'

class Display extends BaseModel {
  static modelName = 'Display'

  static instanceDefaults () {
    return {
      name: '',
      active: false,
      description: '',
      views: []
    }
  }

  static setupInstance (data, { models }) {
    if (data.views && Array.isArray(data.views)) {
      data.views = data.views.map(view => new models.api.View(view))
    }

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
