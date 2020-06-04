<template>
    <div>
        <header class="w3-container">
            <h2>Ansichten f&uuml;r Display '{{ displayName }}'</h2>
        </header>

        <div v-if="error" class="error">
            <strong>{{ error.title || 'Fehler' }}</strong>
            <p>{{ error.message }}</p>
        </div>

        <div v-if="loading">
            <p>
                <font-awesome-icon icon="spinner" spin /> Daten werden abgerufen ...
            </p>
        </div>

        <div v-if="views.length > 0" class="w3-container">
            <h3>Ruhemodus</h3>
            <ul class="w3-ul" v-if="idleScreenViews.length > 0">
                <ViewListItem v-for="view in idleScreenViews" :key="view.id" :view="view"/>
            </ul>
            <p v-else>
                Noch nicht konfiguriert
            </p>

            <h3>Alarmmodus</h3>
            <ul class="w3-ul" v-if="alarmScreenViews.length > 0">
                <ViewListItem v-for="view in alarmScreenViews" :key="view.id" :view="view"/>
            </ul>
            <p v-else>
                Noch nicht konfiguriert
            </p>
        </div>
    </div>
</template>

<script>
import ViewListItem from '@/components/ViewListItem'
import axios from 'axios'

export default {
  name: 'ViewList',
  computed: {
    alarmScreenViews: function () {
      return this.views.filter(view => view.screenType === 'AlarmScreen')
    },
    displayName: function () {
      const display = this.$store.state.displays.get(parseInt(this.display_id))
      return display.name || 'Unbenannt'
    },
    idleScreenViews: function () {
      return this.views.filter(view => view.screenType === 'idle')
    }
  },
  components: {
    ViewListItem
  },
  created: function () {
    this.fetchData()
  },
  data: function () {
    return {
      error: null,
      loading: false,
      views: []
    }
  },
  methods: {
    fetchData: function () {
      this.loading = true
      this.error = null
      this.views = []
      axios.get(`/api/v1/displays/${this.display_id}/views`)
        .then(response => {
          this.views = response.data
        })
        .catch(error => {
          this.error = error
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  props: ['display_id'],
  watch: {
    $route: 'fetchData'
  }
}
</script>

<style scoped>

</style>
