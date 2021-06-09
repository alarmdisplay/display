import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import auth from '@feathersjs/authentication-client'
import io from 'socket.io-client'
import { iff, discard } from 'feathers-hooks-common'
import feathersVuex from 'feathers-vuex'

const socket = io({ transports: ['websocket'] })

const feathersClient = feathers()
  .configure(socketio(socket))
  .configure(auth({ storage: window.localStorage, storageKey: 'display-console-jwt' }))
  .hooks({
    before: {
      all: [
        // Prevent sending local-only properties to the server
        iff(
          context => ['create', 'update', 'patch'].includes(context.method),
          discard('__id', '__isTemp')
        )
      ]
    }
  })

export default feathersClient

// Setting up feathers-vuex
const { makeServicePlugin, makeAuthPlugin, BaseModel, models, FeathersVuex } = feathersVuex(
  feathersClient,
  {
    serverAlias: 'api',
    idField: 'id',
    whitelist: ['$regex', '$options']
  }
)

export { makeAuthPlugin, makeServicePlugin, BaseModel, models, FeathersVuex }
