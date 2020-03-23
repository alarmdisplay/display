<template>
    <nav class="w3-sidebar w3-collapse w3-white w3-animate-left" style="z-index:3;width:300px;" id="mySidebar"><br>
        <div class="w3-bar-block">
            <a href="#" class="w3-bar-item w3-button w3-padding-16 w3-hide-large w3-dark-grey w3-hover-black" v-on:click="hideSidebar" title="close menu"><font-awesome-icon icon="times" fixed-width />  Men&uuml; schlie&szlig;en</a>
            <a href="#" class="w3-bar-item w3-button w3-padding w3-blue"><font-awesome-icon icon="home" fixed-width /> &Uuml;bersicht</a>
            <a href="#" class="w3-bar-item w3-button w3-padding"><font-awesome-icon icon="desktop" fixed-width /> Displays</a>
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
</style>
