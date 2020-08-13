import Vue from 'vue'
import Vuex from 'vuex'
import { FeathersVuex } from '@/feathers-client'
import auth from './store.auth'

import announcements from './services/announcements'
import contentSlotOptions from './services/content-slot-options'
import contentSlots from './services/content-slots'
import displays from './services/displays'
import incidents from './services/incidents'
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
    contentSlotOptions,
    contentSlots,
    displays,
    incidents,
    locations,
    users,
    views
  ]
})
