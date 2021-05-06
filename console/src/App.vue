<template>
  <div id="app">
    <div v-if="showConnectionBanner" :class="['has-text-white', 'has-text-weight-bold', 'has-text-centered', 'p-1', socketIsConnected ? 'has-background-success' : 'has-background-danger']">
      <span v-if="socketIsConnected">
          Verbunden
      </span>
      <span v-else class="icon-text">
        <span class="icon"><font-awesome-icon icon="spinner" spin/></span>
        <span>Keine Verbindung zum Server &hellip;</span>
      </span>
    </div>
    <Navbar v-if="loggedIn"/>
    <router-view v-if="loggedIn"/>
    <Setup v-else-if="showSetup"/>
    <Login v-else/>
  </div>
</template>

<script>
import 'bulma/css/bulma.css'
import Navbar from './components/Navbar'
import Login from './views/Login'
import Setup from '@/views/Setup'

export default {
  name: 'App',
  components: {
    Setup,
    Login,
    Navbar
  },
  computed: {
    loggedIn: function () {
      return this.$store.getters['auth/isAuthenticated']
    },
    showSetup () {
      return this.$store.state.showSetup
    },
    socketIsConnected () {
      return this.$store.state.socket.connected
    }
  },
  created () {
    // Try to authenticate, which populates the auth store. Based on that, the app will ask for a login or not
    this.$store.dispatch('auth/authenticate').catch(() => {
      // No need to worry. This just means the session expired or there was no token in the first place.
    })
  },
  data () {
    return {
      hideConnectionBannerTimeout: null,
      showConnectionBanner: false,
      showConnectionBannerTimeout: null
    }
  },
  watch: {
    socketIsConnected (connected) {
      clearTimeout(this.hideConnectionBannerTimeout)
      clearTimeout(this.showConnectionBannerTimeout)
      if (connected && this.showConnectionBanner) {
        this.hideConnectionBannerTimeout = setTimeout(() => {
          this.showConnectionBanner = false
        }, 1500)
      } else if (!connected && !this.showConnectionBanner) {
        this.showConnectionBannerTimeout = setTimeout(() => {
          this.showConnectionBanner = true
        }, 500)
      }
    }
  }
}
</script>

<style>
</style>
