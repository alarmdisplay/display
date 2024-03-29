import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client'

class Setting extends BaseModel {
  static modelName = 'Setting'
  static idField = 'key' // Workaround, see https://github.com/feathersjs-ecosystem/feathers-vuex/issues/542

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
  idField: 'key',
  getters: {
    getIntegerValue: (state, getters) => (id, params) => {
      const value = getters.getValue(id, params)
      return Number.parseInt(value)
    },
    getCoordinateValue: (state, getters) => (id, params) => {
      const value = getters.getValue(id, params)
      if (!value || !value.latitude || !value.longitude) {
        return null
      }

      const coordinateValue = {
        latitude: Number.parseFloat(value.latitude),
        longitude: Number.parseFloat(value.longitude)
      }

      if (Number.isNaN(coordinateValue.latitude) || Number.isNaN(coordinateValue.longitude)) {
        return null
      }

      return coordinateValue
    },
    getStringValue: (state, getters) => (id, params) => {
      const value = getters.getValue(id, params)
      return String(value || '')
    },
    getValue: (state, getters) => (id, params) => {
      const setting = getters.get(id, params)
      return setting?.value
    }
  },
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
