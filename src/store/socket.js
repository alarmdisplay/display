// initial state
const state = () => ({
    connected: false,
    keyRequestId: null
})

const getters = {}

const actions = {}

const mutations = {
    setConnected (state, connected) {
        state.connected = connected === true
    },
    setKeyRequestId (state, value) {
        state.keyRequestId = value
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
        })
        socket.on('api/v1/key-requests patched', (data) => {
            let keyRequestId = store.state.socket.keyRequestId;
            if (!keyRequestId) {
                console.error('No key request active, this update should not have been sent here')
                return
            }

            if (data.requestId === keyRequestId) {
                console.log('Key request got updated')
                if (!data.apiKey || data.apiKey === '') {
                    console.error('Updated key request did not contain an API key')
                    return
                }

                // Store the API key and reload the entire app
                localStorage.setItem('display-api-key', data.apiKey);
                location.reload()
            }
        })
    }
}
