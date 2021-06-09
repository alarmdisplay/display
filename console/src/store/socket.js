// initial state
const state = () => ({
  connected: false
})

const getters = {}

const actions = {}

const mutations = {
  setConnected (state, connected) {
    state.connected = connected === true
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

export function createSocketPlugin (socket) {
  return store => {
    socket.on('connect', () => {
      store.commit('socket/setConnected', true)
    })
    socket.on('disconnect', () => {
      store.commit('socket/setConnected', false)

      // Clear all key requests, because the server only stores them in memory and IDs could be reused after a restart
      store.commit('key-requests/clearAll')
    })
    socket.on('connect_error', (err) => {
      console.error('Socket connect error', err)
      store.commit('socket/setConnected', false)
    })
    socket.on('connect_timeout', (timeout) => {
      console.error('Socket connect timeout', timeout)
    })
    socket.on('error', (err) => {
      console.error('Socket error', err)
    })
  }
}
