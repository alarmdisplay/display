<template>
    <div>
        <header class="w3-container">
            <h2>Komponenten</h2>
            <router-link tag="button" :to="`/components/new`" class="w3-btn w3-blue w3-right">Neu</router-link>
        </header>

        <ul class="w3-ul">
            <ComponentListItem v-for="componentObject in componentObjects" v-bind:key="componentObject.id" :component-object="componentObject"/>
        </ul>
    </div>
</template>

<script>
import ComponentListItem from '@/components/ComponentListItem'

export default {
  name: 'ComponentList',
  computed: {
    componentObjects: function () {
      return this.$store.state.components
    }
  },
  components: {
    ComponentListItem
  }
}
</script>

<style scoped>
</style>
