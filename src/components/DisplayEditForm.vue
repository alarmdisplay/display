<template>
    <div class="w3-main">
        <header class="w3-container">
            <h2>Display bearbeiten</h2>
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

            <div v-if="displayData">
                <form>
                    <p>
                        <label for="input-name">Name:</label>
                        <input id="input-name" type="text" class="w3-input w3-border" v-model.trim="displayData.name">
                    </p>
                    <p>
                        <label for="input-client-id">Client ID:</label>
                        <input id="input-client-id" type="text" maxlength="8" class="w3-input w3-border" v-model.trim="displayData.clientId">

                        <input id="input-active" type="checkbox" class="w3-check" v-model="displayData.active">
                        <label for="input-active">Display darf sich verbinden</label>
                    </p>
                    <p>
                        <label for="input-description">Beschreibung:</label>
                        <input id="input-description" type="text" class="w3-input w3-border" v-model.trim="displayData.description">
                    </p>
                    <p>
                        <label for="input-location">Ort:</label>
                        <input id="input-location" type="text" class="w3-input w3-border" v-model.trim="displayData.location">
                    </p>
                    <div class="w3-row">
                        <div class="w3-third w3-padding">
                            <button class="w3-btn w3-block w3-gray" @click="maybeCancel">Abbrechen</button>
                        </div>
                        <div class="w3-third w3-padding">
                            <button class="w3-btn w3-block w3-red" @click="deleteDisplay">Löschen</button>
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
  name: 'DisplayEditForm',
  data: function () {
    return {
      displayData: null,
      error: null,
      loading: false,
      saveButtonEnabled: false
    }
  },
  created: function () {
    this.fetchData()
  },
  methods: {
    deleteDisplay: function () {
      // TODO are you sure?
      this.$store.dispatch('deleteDisplay', this.id)
        .then(() => {
          this.$router.replace('/displays')
        })
    },
    fetchData: function () {
      this.displayData = null
      this.loading = true
      this.error = ''
      axios.get('/api/v1/displays/' + this.id)
        .then(response => {
          this.displayData = response.data
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
      axios.put('/api/v1/displays/' + this.id, this.displayData)
        .then(response => {
          this.$router.replace('/displays')
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
header {
    padding-top: 22px;
}

#input-client-id {
    width: unset;
}

#button-save {
    float: right;
}
</style>
