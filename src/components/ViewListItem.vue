<template>
    <li class="w3-bar">
        <div class="w3-bar-item" style="vertical-align: center">
            <font-awesome-icon icon="columns" size="2x"/>
        </div>
        <div class="w3-bar-item">
            <span class="w3-large">{{ view.name || 'Kein Name' }}</span><br>
            <span>{{ view.screenType }}</span>
        </div>
        <router-link :to="`/displays/${view.displayId}/views/${view.id}`" tag="button" class="w3-bar-item w3-button w3-border w3-border-blue w3-hover-blue w3-round-medium w3-right">
            <font-awesome-icon icon="pencil-alt"/> Bearbeiten
        </router-link>
    </li>
</template>

<script>
export default {
  name: 'ViewListItem',
  props: {
    view: Object
  }
}
</script>

<style scoped>

</style>
