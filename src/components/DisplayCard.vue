<template>
    <div class="w3-card-4">
        <header class="w3-container w3-light-grey">
            <h3><font-awesome-icon v-bind:icon="icon" />{{ display.id }}</h3>
        </header>

        <div class="w3-container">
            <p>{{ display.location }}</p>
        </div>

        <button class="w3-button w3-block w3-dark-grey">Edit</button>
    </div>
</template>

<script>
export default {
  name: 'DisplayCard',
  computed: {
    icon: function () {
      return 'desktop'
    }
  },
  props: {
    display: Object
  }
}
</script>

<style scoped>
h3 svg {
    margin-right: 0.4em;
}
</style>
