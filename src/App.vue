<template>
  <div id="app">
    <SplashScreen v-if="showSplashScreen === true"/>
    <DisplayApp v-else-if="showApp === true" :the-display-id="displayId"/>
    <DisplaySetup v-else/>
  </div>
</template>

<script>
import DisplayApp from "@/components/DisplayApp";
import DisplaySetup from "@/components/DisplaySetup";
import SplashScreen from "@/components/SplashScreen";

export default {
  name: 'App',
  components: {
    DisplayApp,
    DisplaySetup,
    SplashScreen
  },
  computed: {
    displayId: function () {
      return this.$store.state.ownDisplayId
    },
    showApp: function () {
      return !this.showSplashScreen && this.$store.state.socket.connected && this.displayId !== undefined
    },
    showSplashScreen() {
      return this.$store.state.showSplashScreen
    }
  },
  mounted() {
    this.$store.subscribe(mutation => {
      if (mutation.type === 'socket/setConnected' && mutation.payload === true) {
        this.$store.dispatch('displays/get', 'self')
          .catch(reason => console.error('Error while asking the backend about our identity', reason))
      }
    })
  }
}
</script>

<style>
#app {
  font-family: 'Open Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

body {
  height: 100%;
  margin: 0;
  padding: 0;
}

html {
  height: 100vh;
  background-color: #777777;
  color: #dddddd;
}

.gridview-component {
  overflow: hidden;
  padding: 1em;
  text-align: center;
}
</style>
