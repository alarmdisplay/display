import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'

import axios from 'axios'

// Import Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars, faBullhorn, faClock, faCloudShowersHeavy, faColumns, faCube, faCubes, faDesktop, faHome, faPencilAlt, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Import components
import ComponentCreateForm from '@/components/ComponentCreateForm'
import ComponentEditForm from '@/components/ComponentEditForm'
import ComponentList from '@/components/ComponentList'
import DisplayCreateForm from '@/components/DisplayCreateForm'
import DisplayEditForm from '@/components/DisplayEditForm'
import DisplayList from '@/components/DisplayList'
import Overview from '@/components/Overview'
import ViewEditForm from '@/components/ViewEditForm'
import ViewList from '@/components/ViewList'

// Configure Font Awesome
library.add(faBars, faBullhorn, faClock, faCloudShowersHeavy, faColumns, faCube, faCubes, faDesktop, faHome, faPencilAlt, faSpinner, faTimes)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(Vuex)
Vue.use(VueRouter)

Vue.config.productionTip = false

// Set up the Vuex store
const store = new Vuex.Store({
  state: {
    displays: new Map(),
    views: {},
    components: []
  },
  mutations: {
    appendComponent (state, component) {
      state.components.push(component)
    },
    setComponents (state, components) {
      state.components = components
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
    createComponent (context, component) {
      return axios.post('/api/v1/components', component)
        .then(response => {
          const newComponent = response.data
          context.commit('appendComponent', newComponent)
          return newComponent
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
    deleteComponent (context, componentId) {
      return axios.delete('/api/v1/components/' + componentId)
        .then(() => context.dispatch('fetchTheComponents'))
    },
    deleteDisplay (context, displayId) {
      return axios.delete('/api/v1/displays/' + displayId)
        .then(() => context.dispatch('fetchTheDisplays'))
    },
    deleteView (context, data) {
      return axios.delete(`/api/v1/displays/${data.displayId}/views/${data.viewId}`)
        .then(() => context.dispatch('fetchTheViews', data.displayId))
    },
    fetchTheComponents (context) {
      return axios.get('/api/v1/components')
        .then(response => context.commit('setComponents', response.data))
    },
    fetchTheDisplays (context) {
      return axios.get('/api/v1/displays')
        .then(response => context.commit('setDisplays', response.data))
    },
    fetchTheViews (context, displayId) {
      return axios.get(`/api/v1/displays/${displayId}/views`)
        .then(response => context.commit('setViews', { displayId: displayId, views: response.data }))
    },
    updateComponent (context, update) {
      return axios.put(`/api/v1/components/${update.id}`, update.data)
        .then(() => context.dispatch('fetchTheComponents'))
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
  { path: '/components', component: ComponentList },
  { path: '/components/new', component: ComponentCreateForm },
  { path: '/components/:id', component: ComponentEditForm, props: true },
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
