<template>
    <section class="section">
      <div class="container">
        <h1 class="title">Ansichten f&uuml;r Display {{ displayId || '??' }}</h1>

        <div class="buttons is-left">
          <BackButton :path="{ name: 'display-list' }"/>
        </div>

        <div>
          <h2 class="subtitle">Ruhemodus</h2>
          <div class="content">
            Sofern kein Alarm vorliegt, befindet sich das Display im Ruhemodus.
            Dort können allgemeine Informationen angezeigt werden.
          </div>
          <div v-if="views.length" class="columns is-multiline">
            <div class="column is-one-third" v-for="view in views" :key="view.id">
              <ViewListItem :view="view"/>
            </div>
          </div>
          <div class="buttons">
            <button type="button" class="button has-icons-left" @click="addView()">
              <span class="icon">
              <font-awesome-icon icon="plus"/>
              </span>
              <span>Ansicht hinzufügen</span>
            </button>
          </div>
          <div class="content">
            Ist keine Ansicht konfiguriert, werden Uhrzeit und Datum mittig auf dem Bildschirm angezeigt.
            Ist mehr als eine Ansicht konfiguriert, werden die Ansichten im Wechsel angezeigt, jeweils für eine Minute.
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
import BackButton from '@/components/BackButton'
import ViewListItem from '@/components/views/ViewListItem'

export default {
  name: 'ViewList',
  computed: {
    displayId () {
      return parseInt(this.$route.params.display_id)
    },
    viewsParams () {
      return { query: { displayId: this.displayId, $sort: { order: 1 } } }
    }
  },
  components: {
    BackButton,
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
