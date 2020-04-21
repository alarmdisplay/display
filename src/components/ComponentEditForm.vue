<template>
    <div>
        <header class="w3-container">
            <h2>Komponente bearbeiten</h2>
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

            <div v-if="componentData">
                <form>
                    <p>
                        <label for="input-name">Name:</label>
                        <input id="input-name" type="text" class="w3-input w3-border" v-model.trim="componentData.name">
                    </p>
                    <div class="w3-row">
                        <div class="w3-third w3-padding">
                            <button class="w3-btn w3-block w3-gray" @click="maybeCancel">Abbrechen</button>
                        </div>
                        <div class="w3-third w3-padding">
                            <button class="w3-btn w3-block w3-red" @click="deleteComponent">Löschen</button>
                        </div>
                        <div class="w3-third w3-padding">
                            <button id="button-save" class="w3-btn w3-block w3-green" v-on:click="saveChanges" :disabled="!saveButtonEnabled">Speichern</button>
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
  name: 'ComponentEditForm',
  data: function () {
    return {
      componentData: null,
      error: null,
      loading: false,
      saveButtonEnabled: false
    }
  },
  created: function () {
    this.fetchData()
  },
  methods: {
    deleteComponent: function () {
      // TODO are you sure?
      this.$store.dispatch('deleteComponent', this.id)
        .then(() => {
          this.$router.replace('/components')
        })
    },
    fetchData: function () {
      this.componentData = null
      this.loading = true
      this.error = ''
      axios.get('/api/v1/components/' + this.id)
        .then(response => {
          this.componentData = {
            name: response.data.name || ''
          }
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
    maybeCancel: function () {
      // TODO check if data is dirty
      this.$router.back()
    },
    saveChanges: function () {
      this.saveButtonEnabled = false
      this.$store.dispatch('updateComponent', { id: this.id, data: this.componentData })
        .then(() => {
          this.$router.replace('/components')
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
  props: ['id'],
  watch: {
    $route: 'fetchData'
  }
}
</script>

<style scoped>
#button-save {
    float: right;
}
</style>
