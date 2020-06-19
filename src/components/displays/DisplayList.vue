<template>
    <div>
        <header class="w3-container">
            <h2>Displays</h2>
        </header>

        <div class="displays">
            <DisplayCard v-for="display in displays" :key="display.id" :display="display" />
            <router-link tag="a" :to="`/displays/new`" class="w3-button add-display">
                <font-awesome-icon icon="plus-circle" size="2x"/><br>
                Display hinzufügen
            </router-link>
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
        align-items: center;
    }

    .add-display {
        margin: 1em;
    }
</style>
