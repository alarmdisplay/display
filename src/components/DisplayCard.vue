<template>
    <div class="w3-card-4 display-card">
        <header class="w3-container w3-light-grey">
            <h3><font-awesome-icon v-bind:icon="icon" />{{ display.name }}</h3>
            <span class="tech-info">ID {{ display.id }} | Zuletzt online: {{ lastSeen }}</span>
        </header>

        <div class="w3-container">
            <p><strong>Ort:</strong> {{ display.location }}</p>
        </div>

        <router-link tag="button" :to="`/displays/${display.id}`" class="w3-button w3-block w3-dark-grey">Bearbeiten</router-link>
    </div>
</template>

<script>
export default {
  name: 'DisplayCard',
  computed: {
    icon: function () {
      return 'desktop'
    },
    lastSeen: function () {
      if (!this.display.lastSeen) {
        return 'unbekannt'
      }

      // TODO use human-readable date representation
      return this.display.lastSeen
    }
  },
  props: {
    display: Object
  }
}
</script>

<style scoped>
.display-card {
    margin-bottom: 2em;
}

h3 svg {
    margin-right: 0.4em;
}

header {
    border-bottom: 1px solid gray;
}

.tech-info {
    font-size: small;
}
</style>
