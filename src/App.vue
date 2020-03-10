<template>
  <div id="app">
    <SplashScreen v-if="showSplashScreen === true"/>
    <DisplayApp v-else-if="authenticated === true"/>
    <DisplaySetup v-else v-bind:display-identifier="displayId"/>
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
  props: {
    authenticated: Boolean,
    displayId: String,
    showSplashScreen: Boolean
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  height: 100%;
  overflow: hidden;
}

body {
  height: 100%;
}

html {
  height: 100%;
  background-color: #777777;
}
</style>
