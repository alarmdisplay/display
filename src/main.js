import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'

import axios from 'axios'
import moment from 'moment'
import VueMoment from 'vue-moment'

// Import Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowsAlt, faBars, faBullhorn, faClock, faCloudShowersHeavy, faColumns, faCube, faCubes, faDesktop, faExpandAlt, faHome, faPencilAlt, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Import components
import AnnouncementCreateForm from '@/components/content/announcements/CreateForm'
import AnnouncementEditForm from '@/components/content/announcements/EditForm'
import AnnouncementList from '@/components/content/announcements/List'
import DisplayCreateForm from '@/components/displays/DisplayCreateForm'
import DisplayEditForm from '@/components/displays/DisplayEditForm'
import DisplayList from '@/components/displays/DisplayList'
import Overview from '@/components/Overview'
import ViewEditForm from '@/components/views/ViewEditForm'
import ViewList from '@/components/views/ViewList'

// Configure Font Awesome
library.add(faArrowsAlt, faBars, faBullhorn, faClock, faCloudShowersHeavy, faColumns, faCube, faCubes, faDesktop, faExpandAlt, faHome, faPencilAlt, faSpinner, faTimes)
Vue.component('font-awesome-icon', FontAwesomeIcon)

require('moment/locale/de')

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(VueMoment, { moment })

Vue.config.productionTip = false

// Set up the Vuex store
const store = new Vuex.Store({
  state: {
    announcements: [],
    displays: new Map(),
    views: {}
  },
  mutations: {
    appendAnnouncement (state, announcement) {
      state.announcements.push(announcement)
    },
    setAnnouncements (state, announcements) {
      state.announcements = announcements
    },
    setDisplay (state, display) {
      state.displays.set(display.id, display)
    },
    setDisplays (state, displays) {
      state.displays.clear()
      for (const display of displays) {
        state.displays.set(display.id, display)
      }
    },
    setViews (state, data) {
      state.views[data.displayId] = data.views
    }
  },
  actions: {
    createAnnouncement (context, announcement) {
      return axios.post('/api/v1/announcements', announcement)
        .then(response => {
          const newAnnouncement = response.data
          context.commit('appendAnnouncement', newAnnouncement)
          return newAnnouncement
        })
    },
    createDisplay (context, display) {
      return axios.post('/api/v1/displays', display)
        .then(response => {
          const newDisplay = response.data
          context.commit('setDisplay', newDisplay)
          return newDisplay
        })
    },
    deleteAnnouncement (context, announcementId) {
      return axios.delete('/api/v1/announcements/' + announcementId)
        .then(() => context.dispatch('fetchTheAnnouncements'))
    },
    deleteDisplay (context, displayId) {
      return axios.delete('/api/v1/displays/' + displayId)
        .then(() => context.dispatch('fetchTheDisplays'))
    },
    deleteView (context, data) {
      return axios.delete(`/api/v1/displays/${data.displayId}/views/${data.viewId}`)
        .then(() => context.dispatch('fetchTheViews', data.displayId))
    },
    fetchTheAnnouncements (context) {
      return axios.get('/api/v1/announcements')
        .then(response => context.commit('setAnnouncements', response.data))
    },
    fetchTheDisplays (context) {
      return axios.get('/api/v1/displays')
        .then(response => context.commit('setDisplays', response.data))
    },
    fetchTheViews (context, displayId) {
      return axios.get(`/api/v1/displays/${displayId}/views`)
        .then(response => context.commit('setViews', { displayId: displayId, views: response.data }))
    },
    updateAnnouncement (context, update) {
      return axios.put(`/api/v1/announcements/${update.id}`, update.data)
        .then(() => context.dispatch('fetchTheAnnouncements'))
    },
    updateView (context, update) {
      return axios.put(`/api/v1/displays/${update.displayId}/views/${update.viewId}`, update.data)
        .then(() => context.dispatch('fetchTheViews', update.displayId))
    }
  }
})

// Set up the Vue Router
const routes = [
  { path: '/', component: Overview },
  { path: '/announcements', component: AnnouncementList },
  { path: '/announcements/new', component: AnnouncementCreateForm },
  { path: '/announcements/:id', component: AnnouncementEditForm, props: true },
  { path: '/displays', component: DisplayList },
  { path: '/displays/new', component: DisplayCreateForm },
  { path: '/displays/:id', component: DisplayEditForm, props: true },
  { path: '/displays/:display_id/views', component: ViewList, props: true },
  { path: '/displays/:display_id/views/:view_id', component: ViewEditForm, props: true }
]

const router = new VueRouter({
  routes: routes,
  linkActiveClass: 'w3-blue'
})

// Set up the Vue root instance
new Vue({
  store,
  render: h => h(App),
  router: router
}).$mount('#app')
