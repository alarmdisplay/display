<template>
    <section class="section">
      <div class="container">
        <h1 class="title">Ansichten f&uuml;r Display {{ displayId || '??' }}</h1>

        <div v-if="views.length">
          <h2 class="subtitle">Ruhemodus</h2>
          <div class="content">
            Sofern kein Alarm vorliegt, befindet sich das Display im Ruhemodus.
          </div>
          <div class="buttons">
            <button type="button" class="button has-icons-left" @click="addView()">
              <span class="icon">
              <font-awesome-icon icon="plus"/>
              </span>
              <span>Ansicht hinzufügen</span>
            </button>
          </div>
          <div class="columns">
            <div class="column is-one-third" v-for="view in idleScreenViews" :key="view.id">
              <ViewListItem :view="view" :removable="views.length > 1"/>
            </div>
          </div>
          <div class="content">
            Wenn mehr als eine Anzeige konfiguriert ist, werden die Ansichten im Wechsel angezeigt, jeweils für eine Minute.
          </div>

          <h2 class="subtitle">Alarmbildschirm</h2>
          <div class="content">
            Für den Alarmbildschirm besteht aktuell noch keine Möglichkeit zur Konfiguration.
          </div>
        </div>
        </div>
    </section>
</template>

<script>
import { makeFindMixin } from 'feathers-vuex'
import ViewListItem from '@/components/views/ViewListItem'

export default {
  name: 'ViewList',
  computed: {
    idleScreenViews: function () {
      // return this.views.filter(view => view.screenType === 'idle')
      return this.views
    },
    displayId () {
      return parseInt(this.$route.params.display_id)
    },
    viewsParams () {
      return { query: { displayId: this.displayId, $sort: { order: 1 } } }
    }
  },
  components: {
    ViewListItem
  },
  methods: {
    addView () {
      const { View } = this.$FeathersVuex.api
      const view = new View()
      view.displayId = this.displayId
      view.type = 'idle'
      view.order = this.views.length + 1
      view.save()
    }
  },
  mixins: [
    makeFindMixin({ service: 'views', name: 'views', params: 'viewsParams', qid: 'viewsList', local: true })
  ],
  watch: {
    displayId: {
      handler (value) {
        if (value === 'new') {
          return
        }
        const { Display } = this.$FeathersVuex.api
        const existingRecord = Display.getFromStore(value)

        // If the record was not in the store, we have to fetch it from the server
        if (!existingRecord) {
          Display.get(value)
        }
      },
      immediate: true // Run this handler when the component is created
    }
  }
}
</script>

<style scoped>

</style>
