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

        <div v-if="views != null" class="w3-container">
            <h3>Ruhemodus</h3>
            <p>
                Sofern kein Alarm vorliegt, befindet sich das Display im Ruhemodus.
            </p>
            <div class="views">
                <ViewListItem v-for="view in idleScreenViews" :key="view.id" :view="view"/>
                <button type="button" class="w3-button" @click="addView('idle')">
                    <font-awesome-icon icon="plus-circle" size="2x"/><br>
                    Ansicht hinzufügen
                </button>
            </div>
            <p>
                Wenn mehr als eine Anzeige konfiguriert ist, werden die Ansichten im Wechsel angezeigt.
                Jede Ansicht wird dabei für 1 Minute angezeigt.
            </p>

            <h3>Alarmbildschirm</h3>
            <p>
                Für den Alarmbildschirm besteht noch keine Möglichkeit zur Konfiguration.
            </p>
        </div>
    </div>
</template>

<script>
import ViewListItem from '@/components/views/ViewListItem'
import axios from 'axios'

export default {
  name: 'ViewList',
  computed: {
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
    addView: function (screenType) {
      this.$store.dispatch('createEmptyView', { displayId: this.display_id, screenType: screenType })
        .then(() => this.fetchData())
    },
    fetchData: function () {
      this.loading = true
      this.error = null
      this.views = null
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
.views {
    display: flex;
    flex-flow: row wrap;
}
</style>
