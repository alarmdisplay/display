<template>
    <div>
        <header class="w3-container">
            <h2>Ank&uuml;ndigungen</h2>
        </header>

        <router-link to="/announcements/new" tag="button" class="w3-button w3-border w3-border-blue w3-hover-blue w3-round-medium w3-margin">
            <font-awesome-icon icon="plus-circle"/> Neue Ank&uuml;ndigung anlegen
        </router-link>
        <ul class="w3-ul">
            <ListItem v-for="announcement in announcements" v-bind:key="announcement.id" :announcement="announcement"/>
        </ul>
    </div>
</template>

<script>
import ListItem from '@/components/content/announcements/ListItem'
export default {
  name: 'AnnouncementList',
  components: {
    ListItem
  },
  computed: {
    announcements: function () {
      return this.$store.state.announcements
    }
  }
}
</script>

<style scoped>

</style>
