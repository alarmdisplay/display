import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client'

class ContentSlot extends BaseModel {
  static modelName = 'ContentSlot'

  static instanceDefaults () {
    return {
      component: 'Clock',
      columnStart: 1,
      columnEnd: 1,
      rowStart: 2,
      rowEnd: 2,
      viewId: null
    }
  }

  static setupInstance (data, { models }) {
    console.log('setup content slot', data)

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

    console.log('the content slot:', data)
    return data
  }

  async save (params) {
    const savedContentSlot = await super.save(params)
    console.log('content slot saved', savedContentSlot)
    const optionIdsToSave = this.options.filter(option => option.id !== undefined).map(option => option.id)
    console.log('saving options', optionIdsToSave)

    const removedOptions = savedContentSlot.options.filter(option => {
      if (option.__id) {
        return false
      }

      return !optionIdsToSave.includes(option.id)
    })
    for (const option of removedOptions) {
      await option.remove()
    }

    // Save the remaining options
    for (const option of this.options) {
      console.log('saving option', option)
      if (option.__id) {
        option.contentSlotId = savedContentSlot.id
      }
      await option.save()
    }

    return savedContentSlot
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
