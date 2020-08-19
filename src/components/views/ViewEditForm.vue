<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Ansicht bearbeiten</h1>

      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <BackButton/>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <button type="button" class="button is-success" @click="saveChanges" :disabled="!saveButtonEnabled">Speichern</button>
          </div>
        </div>
      </div>

      <div v-if="error" class="message is-danger">
        <div class="message-body">
          <strong>{{ error.title || 'Fehler' }}</strong>
          <p>{{ error.message }}</p>
        </div>
      </div>

      <div v-if="loading">
        <p>
          <font-awesome-icon icon="spinner" spin/>
          Daten werden abgerufen ...
        </p>
      </div>

      <div class="columns" v-if="view">
        <div class="column is-two-thirds">
          <div class="preview-container">
            <GridEditor :view-data="view" @content-slot-moved="onContentSlotMoved" @content-slot-resized="onContentSlotResized" @content-slot-removed="removeContentSlot"/>
          </div>
        </div>

        <div class="column is-one-third">
          <div class="panel">
            <div class="panel-heading">Raster</div>
            <div class="panel-block">
              <p>
                Die Komponenten können auf einem Raster angeordnet werden, wobei die Anzahl der Spalten und Zeilen die kleinstmögliche Größe einer Komponente bestimmen. Je mehr Spalten und Zeilen es gibt, desto feiner kann das Layout bestimmt werden. Komponenten können sich über mehrere Zeilen und/oder Spalten erstrecken.
              </p>
            </div>
            <div class="panel-block">
              <p class="control">
                <label class="label" for="input-columns">Spalten:</label>
                <input id="input-columns" type="number" min="1" class="input" v-model.number="view.columns">
              </p>
            </div>
            <div class="panel-block">
              <p class="control">
                <label class="label" for="input-rows">Zeilen:</label>
                <input id="input-rows" type="number" min="1" class="input" v-model.number="view.rows">
              </p>
            </div>
          </div>

          <div class="panel">
            <div class="panel-heading">Komponente hinzufügen</div>
            <div class="panel-block">
              <div class="control">
                <label class="label is-hidden" for="select-component-to-add">Verf&uuml;gbare Komponenten:</label>
                <div class="select">
                  <select id="select-component-to-add">
                    <option value="">Komponente wählen</option>
                    <option v-for="componentType in availableComponentTypes" :key="`add-${componentType}`"
                            :value="componentType">{{ getComponentName(componentType) }}
                    </option>
                  </select>
                </div>
                <button type="button" @click="addContentSlot" class="button">Hinzuf&uuml;gen</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script>
import GridEditor from '@/components/views/editor/GridEditor'
import BackButton from '@/components/BackButton'

export default {
  name: 'ViewEditForm',
  data: function () {
    return {
      availableComponentTypes: ['AnnouncementList', 'DWDWarningMap', 'Clock'],
      error: null,
      loading: false,
      saveButtonEnabled: false
    }
  },
  computed: {
    viewId () {
      return parseInt(this.$route.params.view_id)
    },
    view () {
      const { View } = this.$FeathersVuex.api
      // Get the Display for the given ID or create a new one if the ID is 'new'
      return this.id === 'new' ? new View() : View.getFromStore(this.viewId)
    }
  },
  components: {
    BackButton,
    GridEditor
  },
  methods: {
    addContentSlot: function () {
      const select = document.getElementById('select-component-to-add')
      if (!this.availableComponentTypes.includes(select.value)) {
        return
      }

      this.viewData.contentSlots.push({
        componentType: select.value,
        columnStart: 1,
        rowStart: 1,
        columnEnd: 2,
        rowEnd: 2
      })
    },
    deleteView: function () {
      // TODO are you sure?
      this.$store.dispatch('deleteView', { displayId: this.display_id, viewId: this.view_id })
        .then(() => {
          this.$router.replace(`/displays/${this.display_id}/views`)
        })
    },
    getComponentName: function (componentType) {
      switch (componentType) {
        case 'AnnouncementList':
          return 'Ankündigungen'
        case 'Clock':
          return 'Uhr'
        case 'DWDWarningMap':
          return 'DWD-Warnkarte'
        default:
          return this.componentObject.type
      }
    },
    getIcon: function (componentType) {
      switch (componentType) {
        case 'AnnouncementList':
          return 'bullhorn'
        case 'Clock':
          return 'clock'
        case 'DWDWarningMap':
          return 'cloud-showers-heavy'
        default:
          return 'cube'
      }
    },
    maybeCancel: function () {
      // TODO check if data is dirty
      this.$router.back()
    },
    onContentSlotMoved: function (data) {
      const result = this.viewData.contentSlots.filter(contentSlot => contentSlot.id === data.id)
      if (result.length > 0) {
        const columnDifference = data.newColumn - result[0].columnStart
        const rowDifference = data.newRow - result[0].rowStart
        result[0].columnStart = data.newColumn
        result[0].rowStart = data.newRow
        result[0].columnEnd += columnDifference
        result[0].rowEnd += rowDifference
      }
    },
    onContentSlotResized: function (data) {
      const result = this.viewData.contentSlots.filter(contentSlot => contentSlot.id === data.id)
      // Only accept a resize, if the new values make sense (i.e. the end values are greater than the start values)
      if (result.length > 0 && data.newColumn >= result[0].columnStart + 1 && data.newRow >= result[0].rowStart + 1) {
        result[0].columnEnd = data.newColumn
        result[0].rowEnd = data.newRow
      }
    },
    removeContentSlot: function (id) {
      this.viewData.contentSlots = this.viewData.contentSlots.filter(contentSlot => contentSlot.id !== id)
    },
    saveChanges: function () {
      // TODO
    }
  },
  watch: {
    viewId: {
      handler (value) {
        if (value === 'new') {
          return
        }
        const { View } = this.$FeathersVuex.api
        const existingRecord = View.getFromStore(value)

        // If the record was not in the store, we have to fetch it from the server
        if (!existingRecord) {
          View.get(value)
        }
      },
      immediate: true // Run this handler when the component is created
    }
  }
}
</script>

<style scoped>
    .preview-container {
        box-shadow: 0 4px 10px 0 rgba(0,0,0,0.2);
    }
</style>
