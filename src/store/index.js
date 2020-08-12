import Vue from 'vue'
import Vuex from 'vuex'
import feathersClient, { FeathersVuex } from '@/feathers-client'

import displays from './services/displays'
import contentSlots from './services/content-slots'
import incidents from './services/incidents'
import views from "./services/views";
import socket, { createSocketPlugin } from "./socket";

Vue.use(Vuex)
Vue.use(FeathersVuex)

export default new Vuex.Store({
  state: {
    ownDisplayId: undefined,
    showSplashScreen: true
  },
  mutations: {
    setOwnDisplayId: (state, payload) => {
      state.ownDisplayId = payload
    },
    setShowSplashScreen: (state, payload) => {
      state.showSplashScreen = payload
    }
  },
  actions: {
  },
  modules: {
    socket
  },
  plugins: [
    createSocketPlugin(feathersClient.io),
    contentSlots,
    displays,
    incidents,
    views
  ]
})
