<template>
  <div id="app">
    <SplashScreen v-if="showSplashScreen === true"/>
    <DisplayApp v-else-if="showApp === true" v-bind:views="views" :alerts="alerts"/>
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
    showApp: function () {
      return !this.showSplashScreen && this.$store.state.socket.connected
    }
  },
  props: {
    alerts: Array,
    showSplashScreen: Boolean,
    views: Array
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
