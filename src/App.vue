<template>
  <div id="app">
    <div class="w3-bar w3-top w3-black w3-large" style="z-index:4">
      <button class="w3-bar-item w3-button w3-hide-large w3-hover-none w3-hover-text-light-grey" v-on:click="toggleSidebar"><font-awesome-icon icon="bars" /> Menu</button>
      <span class="w3-bar-item w3-right">Display Console</span>
    </div>
    <Sidebar></Sidebar>
    <!-- Overlay effect when opening sidebar on small screens -->
    <div class="w3-overlay w3-hide-large w3-animate-opacity" v-on:click="hideSidebar" style="cursor:pointer" title="close side menu" id="myOverlay"></div>
    <div class="w3-main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar'

export default {
  name: 'App',
  components: {
    Sidebar
  },
  methods: {
    toggleSidebar: function () {
      const mySidebar = document.getElementById('mySidebar')
      const overlayBg = document.getElementById('myOverlay')
      if (mySidebar.style.display === 'block') {
        mySidebar.style.display = 'none'
        overlayBg.style.display = 'none'
      } else {
        mySidebar.style.display = 'block'
        overlayBg.style.display = 'block'
      }
    },
    hideSidebar: function () {
      const mySidebar = document.getElementById('mySidebar')
      const overlayBg = document.getElementById('myOverlay')
      mySidebar.style.display = 'none'
      overlayBg.style.display = 'none'
    }
  }
}
</script>

<style>
  .w3-main {
    margin-left: 300px;
    margin-top: 43px;
  }

  .w3-main header {
    padding-top: 22px;
  }

  .error {
    background-color: rgba(255, 0, 0, 0.5);
    border: 1px solid red;
    padding: 1em;
  }
</style>
