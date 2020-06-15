<template>
    <div>
        <header class="w3-container">
            <h2>Displays</h2>
            <router-link tag="button" :to="`/displays/new`" class="w3-btn w3-blue w3-right">Neu</router-link>
        </header>

        <div class="displays">
            <DisplayCard v-for="display in displays" :key="display.id" :display="display" />
        </div>
    </div>
</template>

<script>
import DisplayCard from '@/components/displays/DisplayCard'

export default {
  name: 'DisplayList',
  components: {
    DisplayCard
  },
  computed: {
    displays: function () {
      return this.$store.state.displays.values()
    }
  }
}
</script>

<style scoped>
    .displays {
        display: flex;
        flex-flow: row wrap;
    }
</style>
