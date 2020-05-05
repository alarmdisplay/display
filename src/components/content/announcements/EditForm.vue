<template>
    <div>
        <header class="w3-container">
            <h2>Ank&uuml;ndigung bearbeiten</h2>
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

            <div v-if="announcementData">
                <form>
                    <p>
                        <label for="input-title">Titel:</label>
                        <input id="input-title" type="text" class="w3-input w3-border" v-model.trim="announcementData.title">
                    </p>
                    <p>
                        <label for="textarea-text">Text:</label>
                        <textarea id="textarea-text" class="w3-input w3-border" v-model.trim="announcementData.text"></textarea>
                    </p>
                    <p>
                        <input id="input-important" type="checkbox" class="w3-check" v-model="announcementData.important">
                        <label for="input-important">Diese Ank&uuml;ndigung als wichtig markieren</label>
                    </p>
                    <div class="w3-row">
                        <div class="w3-third w3-padding">
                            <button class="w3-btn w3-block w3-gray" @click="maybeCancel">Abbrechen</button>
                        </div>
                        <div class="w3-third w3-padding">
                            <button class="w3-btn w3-block w3-red" @click="deleteAnnouncement">L&ouml;schen</button>
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
  name: 'AnnouncementEditForm',
  data: function () {
    return {
      announcementData: null,
      error: null,
      loading: false,
      saveButtonEnabled: false
    }
  },
  created: function () {
    this.fetchData()
  },
  methods: {
    deleteAnnouncement: function () {
      // TODO are you sure?
      this.$store.dispatch('deleteAnnouncement', this.id)
        .then(() => {
          this.$router.replace('/announcements')
        })
    },
    fetchData: function () {
      this.announcementData = null
      this.loading = true
      this.error = ''
      axios.get('/api/v1/announcements/' + this.id)
        .then(response => {
          this.announcementData = {
            title: response.data.title || '',
            text: response.data.text || '',
            important: response.data.important || false
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
      this.$store.dispatch('updateAnnouncement', { id: this.id, data: this.announcementData })
        .then(() => {
          this.$router.replace('/announcements')
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
