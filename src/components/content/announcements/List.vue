<template>
    <div>
        <header class="w3-container">
            <h2>Ank&uuml;ndigungen</h2>
            <router-link tag="button" :to="`/announcements/new`" class="w3-btn w3-blue w3-right">Neu</router-link>
        </header>

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
