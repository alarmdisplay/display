<template>
    <div>
        <header class="w3-container">
            <h2>Ansicht bearbeiten</h2>
        </header>
        <div class="w3-container">
            <div v-if="error" class="error">
                <strong>{{ error.title || 'Fehler' }}</strong>
                <p>{{ error.message }}</p>
            </div>

            <div v-if="loading">
                <p>
                    <font-awesome-icon icon="spinner" spin /> Daten werden abgerufen ...
                </p>
            </div>

            <div v-if="viewData">
                <form class="w3-container" @submit.prevent="saveChanges">
                    <p>
                        <label for="input-name">Name:</label>
                        <input id="input-name" type="text" class="w3-input w3-border" v-model.trim="viewData.name">
                    </p>
                    <p>
                        <label for="input-columns">Spalten:</label>
                        <input id="input-columns" type="number" min="1" class="w3-input w3-border" v-model.number="viewData.columns">
                    </p>
                    <p>
                        <label for="input-rows">Zeilen:</label>
                        <input id="input-rows" type="number" min="1" class="w3-input w3-border" v-model.number="viewData.rows">
                    </p>

                    <h3>Komponenten</h3>
                    <ul class="w3-ul">
                        <li v-for="contentSlot in viewData.contentSlots" :key="contentSlot.id" class="w3-bar">
                            <h4><font-awesome-icon :icon="getIcon(contentSlot.componentType)"/> {{ getComponentName(contentSlot.componentType) }}</h4>
                            <label :for="`input-col-start-${contentSlot.id}`">Startspalte:</label>
                            <input :id="`input-col-start-${contentSlot.id}`" type="number" min="1" class="w3-input w3-border" v-model.number="contentSlot.columnStart">
                            <label :for="`input-row-start-${contentSlot.id}`">Startzeile:</label>
                            <input :id="`input-row-start-${contentSlot.id}`" type="number" min="1" class="w3-input w3-border" v-model.number="contentSlot.rowStart">
                            <label :for="`input-col-end-${contentSlot.id}`">Endspalte:</label>
                            <input :id="`input-col-end-${contentSlot.id}`" type="number" min="1" class="w3-input w3-border" v-model.number="contentSlot.columnEnd">
                            <label :for="`input-row-end-${contentSlot.id}`">Endzeile:</label>
                            <input :id="`input-row-end-${contentSlot.id}`" type="number" min="1" class="w3-input w3-border" v-model.number="contentSlot.rowEnd">
                            <button @click="removeContentSlot(contentSlot)" class="w3-btn w3-red">Komponente entfernen</button>
                        </li>
                    </ul>
                    <label for="select-component-to-add">Verf&uuml;gbare Komponenten: </label>
                    <select id="select-component-to-add">
                        <option value="">Komponente wählen</option>
                        <option v-for="componentType in availableComponentTypes" :key="`add-${componentType}`" :value="componentType">{{ getComponentName(componentType) }}</option>
                    </select>
                    <button @click="addContentSlot" class="w3-btn w3-gray w3-margin-left">Hinzuf&uuml;gen</button>

                    <div class="w3-row">
                        <div class="w3-third w3-padding">
                            <button type="button" class="w3-btn w3-block w3-gray" @click="maybeCancel">Abbrechen</button>
                        </div>
                        <div class="w3-third w3-padding">
                            <button type="button" class="w3-btn w3-block w3-red" @click="deleteView">Löschen</button>
                        </div>
                        <div class="w3-third w3-padding">
                            <button type="submit" class="w3-btn w3-block w3-green" :disabled="!saveButtonEnabled">Speichern</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ViewEditForm',
  data: function () {
    return {
      availableComponentTypes: ['AnnouncementList', 'DWDWarningMap', 'Clock'],
      viewData: null,
      error: null,
      loading: false,
      saveButtonEnabled: false
    }
  },
  created: function () {
    this.fetchData()
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
    fetchData: function () {
      this.viewData = null
      this.loading = true
      this.error = ''
      axios.get(`/api/v1/displays/${this.display_id}/views/${this.view_id}`)
        .then(response => {
          this.viewData = response.data
          this.saveButtonEnabled = true
        })
        .catch(error => {
          this.error = {
            title: 'Die Daten konnten nicht abgerufen werden',
            message: error.message
          }
        })
        .finally(() => {
          this.loading = false
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
    removeContentSlot: function (contentSlotToRemove) {
      this.viewData.contentSlots = this.viewData.contentSlots.filter(contentSlot => contentSlot !== contentSlotToRemove)
    },
    saveChanges: function () {
      this.saveButtonEnabled = false
      this.$store.dispatch('updateView', { displayId: this.display_id, viewId: this.view_id, data: this.viewData })
        .then(() => {
          this.$router.replace(`/displays/${this.display_id}/views`)
        })
        .catch(error => {
          this.error = {
            title: 'Die Daten konnten nicht gespeichert werden',
            message: error.message
          }
          this.saveButtonEnabled = true
        })
    }
  },
  props: ['display_id', 'view_id'],
  watch: {
    $route: 'fetchData'
  }
}
</script>

<style scoped>
</style>
