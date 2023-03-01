<template>
  <div :class="{ test: testAlert }">
    <span>
      {{ text }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'AlertBanner',
  props: {
    testAlert: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    text () {
      if (this.testAlert) {
        return 'Probealarm'
      }

      let message = this.$store.getters['settings/getStringValue']('alert_banner_message')
      return message ? `ALARM – ${message}` : 'ALARM'
    }
  }
}
</script>

<style scoped>
div {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background-color: red;
  font-weight: bold;
}

.test {
    background-color: darkorange !important;
    color: white;
}
</style>
