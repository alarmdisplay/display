<template>
    <div class="w3-main">
        <header class="w3-container">
            <h2>Displays</h2>
        </header>

        <div class="w3-row-padding w3-margin-bottom w3-margin-top">
            <template v-for="display in displays">
                <div class="w3-quarter" v-bind:key="display.id">
                    <DisplayCard v-bind:display="display" />
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import DisplayCard from '@/components/DisplayCard'

export default {
  name: 'DisplayList',
  components: {
    DisplayCard
  },
  computed: {
    displays: function () {
      return this.$store.state.displays
    }
  }
}
</script>

<style scoped>
header {
    padding-top: 22px;
}
</style>
