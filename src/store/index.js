import Vue from 'vue'
import Vuex from 'vuex'
import feathersClient, { FeathersVuex } from '@/feathers-client'

import displays from './services/displays'
import incidents from './services/incidents'
import socket, { createSocketPlugin } from "./socket";

Vue.use(Vuex)
Vue.use(FeathersVuex)

export default new Vuex.Store({
  state: {
    ownDisplayId: undefined
  },
  mutations: {
    setOwnDisplayId: (state, payload) => {
      state.ownDisplayId = payload
    }
  },
  actions: {
  },
  modules: {
    socket
  },
  plugins: [
    createSocketPlugin(feathersClient.io),
    displays,
    incidents
  ]
})
