<template>
    <div class="w3-main">
        <header class="w3-container">
            <h2>{{ heading }}</h2>
        </header>
    </div>
</template>

<script>
export default {
  name: 'DisplayEditForm',
  computed: {
    heading: function () {
      const numberId = Number.parseInt(this.id)
      if (this.id === 'new') {
        return 'Neues Display'
      } else if (Number.isInteger(numberId)) {
        return `Display ${numberId} bearbeiten`
      } else {
        return 'Fehler'
      }
    }
  },
  props: ['id']
}
</script>

<style scoped>
header {
    padding-top: 22px;
}
</style>
