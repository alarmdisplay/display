<template>
  <div id="app">
    <SplashScreen v-if="showSplashScreen === true"/>
    <IdleScreen v-else-if="authenticated === true"/>
    <DisplaySetup v-else v-bind:display-identifier="displayId"/>
  </div>
</template>

<script>
import DisplaySetup from "@/components/DisplaySetup";
import IdleScreen from "@/components/IdleScreen";
import SplashScreen from "@/components/SplashScreen";

export default {
  name: 'App',
  components: {
    DisplaySetup,
    IdleScreen,
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
}
</style>
