<template>
  <div>
    <span>
      {{ text }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'AlertBanner',
  computed: {
    text () {
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
</style>
