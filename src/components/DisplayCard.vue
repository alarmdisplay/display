<template>
    <div class="w3-card-4 display-card">
        <header class="w3-container w3-light-grey">
            <h3><font-awesome-icon v-bind:icon="icon" />{{ display.name }}</h3>
            <span class="tech-info">ID {{ display.id }} | Zuletzt online: {{ lastSeen }}</span>
        </header>

        <div class="w3-container">
            <p class="location"><strong>Ort:</strong> {{ display.location }}</p>
        </div>

        <footer>
            <div class="w3-bar">
                <router-link tag="button" :to="`/displays/${display.id}`" class="w3-bar-item w3-button w3-block w3-dark-grey w3-border" style="width: 50%">
                    <font-awesome-icon icon="pencil-alt"/> Bearbeiten
                </router-link>
                <router-link tag="button" :to="`/displays/${display.id}/views`" class="w3-bar-item w3-button w3-block w3-dark-grey w3-border" style="width: 50%">
                    <font-awesome-icon icon="columns"/> Ansichten
                </router-link>
            </div>
        </footer>
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
    margin: 1em;
    width: 20em;
    overflow: hidden;
}

h3 svg {
    margin-right: 0.4em;
}

header {
    border-bottom: 1px solid gray;
}

header h3 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

footer {
    align-self: end;
}

.tech-info {
    font-size: small;
}

.location {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
