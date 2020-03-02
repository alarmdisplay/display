<template>
  <div id="app">
    <IdleScreen/>
  </div>
</template>

<script>
import IdleScreen from "@/components/IdleScreen";

export default {
  name: 'App',
  components: {
    IdleScreen
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
