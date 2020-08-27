<template>
  <div id="app">
    <SplashScreen v-if="showSplashScreen === true"/>
    <DisplayApp v-else-if="displayId" :the-display-id="displayId"/>
    <DisplaySetup v-else/>
  </div>
</template>

<script>
import DisplayApp from "@/components/DisplayApp";
import DisplaySetup from "@/components/DisplaySetup";
import SplashScreen from "@/components/SplashScreen";
import feathersClient from "@/feathers-client";

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
    showSplashScreen() {
      return this.$store.state.showSplashScreen
    }
  },
  mounted() {
    this.$store.subscribe(mutation => {
      if (mutation.type === 'socket/setConnected' && mutation.payload === true) {
        this.$store.dispatch('displays/get', 'self')
          .catch(reason => {
            console.error('Error while trying to get own Display ID:', reason);
            feathersClient.io.emit('create', 'api/v1/key-requests', {}, (error, result) => {
              if (error) {
                console.error('Could not request API key:', error)
                return
              }

              console.log('Requested API key, request ID is', result.requestId)
              this.$store.commit('socket/setKeyRequestId', result.requestId)
            })
          })
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