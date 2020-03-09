<template>
  <div id="app">
    <DisplaySetup v-if="showSetupInstructions" v-bind:display-identifier="displayId"/>
    <IdleScreen v-else/>
  </div>
</template>

<script>
import DisplaySetup from "@/components/DisplaySetup";
import IdleScreen from "@/components/IdleScreen";

export default {
  name: 'App',
  components: {
    DisplaySetup,
    IdleScreen
  },
  props: {
    displayId: String,
    showSetupInstructions: Boolean
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
