import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    announcements: [],
    displays: new Map(),
    views: {}
  },
  mutations: {
    appendAnnouncement (state, announcement) {
      state.announcements.push(announcement)
    },
    appendView (state, view) {
      if (!state.views[view.displayId]) {
        state.views[view.displayId] = []
      }
      const views = state.views[view.displayId]
      views.push(view)
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
    createEmptyView (context, data) {
      return axios.post(`/api/v1/displays/${data.displayId}/views`, { columns: 3, rows: 3, screenType: data.screenType })
        .then(response => {
          const newView = response.data
          context.commit('appendView', newView)
          return newView
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
