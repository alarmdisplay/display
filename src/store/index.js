import Vue from 'vue'
import Vuex from 'vuex'
import { FeathersVuex } from '@/feathers-client'
import auth from './store.auth'

import announcements from './services/announcements'
import apiKeys from './services/api-keys'
import contentSlotOptions from './services/content-slot-options'
import contentSlots from './services/content-slots'
import displays from './services/displays'
import incidents from './services/incidents'
import keyRequests from './services/key-requests'
import locations from './services/locations'
import users from './services/users'
import views from './services/views'

Vue.use(Vuex)
Vue.use(FeathersVuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  plugins: [
    auth,
    announcements,
    apiKeys,
    contentSlotOptions,
    contentSlots,
    displays,
    incidents,
    keyRequests,
    locations,
    users,
    views
  ]
})
