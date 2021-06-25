import Vue from 'vue'
import Vuex from 'vuex'
import feathersClient, { FeathersVuex } from '@/feathers-client'

import announcements from './services/announcements'
import displays from './services/displays'
import contentSlotOptions from './services/content-slot-options'
import contentSlots from './services/content-slots'
import incidents from './services/incidents'
import keyRequests from './services/key-requests'
import locations from './services/locations'
import settings from './services/settings'
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
    announcements,
    contentSlotOptions,
    contentSlots,
    displays,
    incidents,
    keyRequests,
    locations,
    settings,
    views
  ]
})
