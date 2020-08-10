import Vue from 'vue'
import Vuex from 'vuex'
import feathersClient, { FeathersVuex } from '@/feathers-client'

import incidents from './services/incidents'
import socket, { createSocketPlugin } from "./socket";

Vue.use(Vuex)
Vue.use(FeathersVuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    socket
  },
  plugins: [
    createSocketPlugin(feathersClient.io),
    incidents
  ]
})
