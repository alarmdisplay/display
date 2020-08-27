<template>
  <div class="setup-instructions">
    <h1>{{ socketIsConnected ? 'Display einrichten' : 'Keine Verbindung' }}</h1>
    <div v-if="!socketIsConnected">
      <p>Dieses Display hat keine Verbindung zum Server.</p>
      <p>Überprüfe bitte, ob der Server läuft.</p>
      <p>Falls das Display und der Server auf zwei verschiedenen Geräten laufen, überprüfe die Netzwerkverbindung.</p>
    </div>
    <div v-else-if="keyRequestId">
      <p>Die Verbindung mit dem Server wurde erfolgreich hergestellt.</p>
      <p>Als nächstes muss das Display freigeschaltet werden.</p>
      <p><strong>Bearbeite in der Display Console die Anfrage mit der folgenden ID:</strong></p>
      <span class="request-id">{{ keyRequestId }}</span>
    </div>
    <div v-else>
      <p>Die Verbindung mit dem Server wurde erfolgreich hergestellt.</p>
      <p>Allerdings scheint es ein anderes Problem zu geben. Bitte überprüfe die Logdateien.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "DisplaySetup",
  computed: {
    keyRequestId () {
      return this.$store.state.socket.keyRequestId
    },
    socketIsConnected() {
      return this.$store.state.socket.connected
    }
  }
}
</script>

<style scoped>
.setup-instructions {
  font-size: 2em;
  padding: 1em 1em;
  text-align: center;
}

.request-id {
  font-size: 4em;
  font-weight: bolder;
  letter-spacing: 0.1em;
}
</style>
