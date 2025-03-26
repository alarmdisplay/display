<template>
    <div :class="['has-text-white', 'has-text-weight-bold', 'has-text-centered', 'p-1', socketIsConnected ? 'has-background-success' : 'has-background-danger']">
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

</style>
