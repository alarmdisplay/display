import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client'

class ApiKey extends BaseModel {
  static modelName = 'ApiKey'

  static instanceDefaults () {
    return {
      name: ''
    }
  }
}

const servicePath = 'api/v1/api-keys'
const servicePlugin = makeServicePlugin({
  Model: ApiKey,
  service: feathersClient.service(servicePath),
  servicePath,
  state: {
    createdApiKey: null
  },
  mutations: {
    clearCreatedApiKey: function (state) {
      state.createdApiKey = null
    },
    setCreatedApiKey: function (state, apiKey) {
      // Make a copy of the API key for one-time display
      state.createdApiKey = `${apiKey.id}:${apiKey.token}`
    }
  },
  setupInstance: (data, { store }) => {
    // If this is a newly created API key that includes the token, copy the token and prevent it from being stored
    if (data.token) {
      store.commit('api-keys/setCreatedApiKey', data)
      delete data.token
    }
    return data
  }
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
