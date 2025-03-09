// initial state
const state = () => ({
    connected: false,
    keyRequestId: null,
    lastConnect: null,
    lastDisconnect: null,
})

const getters = {}

const actions = {}

const mutations = {
    setConnected (state, connected) {
        if (connected && !state.connected) {
            // Record the time of (re)connection
            state.lastConnect = new Date()
        } else if (!connected && state.connected) {
            // Record the time when the connection was lost
            state.lastDisconnect = new Date()
        }
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

        // If 'our' display is deleted on the backend, reload the app to restart the onboarding
        socket.on('api/v1/displays removed', (data) => {
            let ownDisplayId = store.state.ownDisplayId;
            if (ownDisplayId && ownDisplayId === data.id) {
                location.reload()
            }
        })

        socket.on('calendar-items bulk-change', async () => {
            // Some bigger change happened, refresh everything
            await store.commit('calendar-items/clearAll');
            await store.dispatch('calendar-items/find', { query: { $sort: { startDate: 1 }, $limit: 25 } })
        })
    }
}
