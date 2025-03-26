<template>
    <div :class="['connection-banner', socketIsConnected ? 'connected' : 'disconnected']">
        <span v-if="socketIsConnected">
          Verbunden
        </span>
        <span v-else class="icon-text">
            <span class="icon"><font-awesome-icon icon="spinner" spin/></span>
            <span>Keine Verbindung zum Server</span>
        </span>
    </div>
</template>

<script>
export default {
  name: 'ConnectionBanner',
  props: {
    socketIsConnected: {
      type: Boolean,
      required: true,
    }
  }
}
</script>

<style scoped>
.connection-banner {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  padding: 0.25rem;
  height: 4%;
}

.icon-text {
  align-items: flex-start;
  color: inherit;
  display: inline-flex;
  flex-wrap: wrap;
  line-height: 1.5rem;
  vertical-align: top;
}

.icon-text .icon {
  flex-grow: 0;
  flex-shrink: 0;
}

.icon {
  align-items: center;
  display: inline-flex;
  justify-content: center;
  height: 1.5rem;
  width: 1.5rem;
}

.connected {
  background-color: #48c78e;
}

.disconnected {
  background-color: #f14668;
}
</style>
