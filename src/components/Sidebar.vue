<template>
    <nav class="w3-sidebar w3-collapse w3-white w3-animate-left" id="mySidebar"><br>
        <div class="w3-bar-block">
            <a href="#" class="w3-bar-item w3-button w3-padding-16 w3-hide-large w3-dark-grey w3-hover-black" v-on:click="hideSidebar" title="close menu"><font-awesome-icon icon="times" fixed-width />  Men&uuml; schlie&szlig;en</a>
            <router-link to="/" class="w3-bar-item w3-button w3-padding" exact><font-awesome-icon icon="home" size="lg" fixed-width /> &Uuml;bersicht</router-link>
            <router-link to="/displays" class="w3-bar-item w3-button w3-padding"><font-awesome-icon icon="desktop" size="lg" fixed-width /> Displays</router-link>
            <hr>
            <router-link to="/announcements" class="w3-bar-item w3-button w3-padding"><font-awesome-icon icon="bullhorn" size="lg" fixed-width /> Ank&uuml;ndigungen</router-link>
        </div>
    </nav>
</template>

<script>
export default {
  name: 'Sidebar',
  methods: {
    hideSidebar: function () {
      const mySidebar = document.getElementById('mySidebar')
      const overlayBg = document.getElementById('myOverlay')
      mySidebar.style.display = 'none'
      overlayBg.style.display = 'none'
    }
  }
}
</script>

<style scoped>
  #mySidebar {
    z-index: 3;
    width: 300px;
  }
</style>
