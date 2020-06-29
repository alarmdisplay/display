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
                <form class="w3-container" @submit.prevent="saveChanges">
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
                            <input id="input-restrict-validfrom" type="checkbox" class="w3-check" v-model="restrictValidFrom">
                            <label for="input-restrict-validfrom">Diese Ank&uuml;ndigung anzeigen ab:</label>
                            <DateTimePicker v-model="validFromDate" :format-options="datePickerOptions.timeFormat" :display-options="datePickerOptions.display"/>
                        </div>
                        <div class="w3-third w3-padding">
                            <input id="input-restrict-validto" type="checkbox" class="w3-check" v-model="restrictValidTo">
                            <label for="input-restrict-validto">Diese Ank&uuml;ndigung anzeigen bis:</label>
                            <DateTimePicker v-model="validToDate" :format-options="datePickerOptions.timeFormat" :display-options="datePickerOptions.display"/>
                        </div>
                    </div>
                    <div class="w3-row">
                        <div class="w3-third w3-padding">
                            <button type="button" class="w3-btn w3-block w3-gray" @click="maybeCancel">Abbrechen</button>
                        </div>
                        <div class="w3-third w3-padding">
                            <button type="button" class="w3-btn w3-block w3-red" @click="deleteAnnouncement">L&ouml;schen</button>
                        </div>
                        <div class="w3-third w3-padding">
                            <button type="submit" id="button-save" class="w3-btn w3-block w3-green" :disabled="!saveButtonEnabled">Speichern</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import DateTimePicker from 'simple-vue2-datetimepicker'

export default {
  name: 'AnnouncementEditForm',
  components: {
    DateTimePicker
  },
  data: function () {
    return {
      announcementData: null,
      error: null,
      loading: false,
      saveButtonEnabled: false,
      restrictValidFrom: false,
      restrictValidTo: false,
      validFromDate: new Date(),
      validToDate: new Date(),
      datePickerOptions: {
        timeFormat: {
          locale: 'de-DE',
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: false
        },
        display: {
          maxWidth: 200
        }
      }
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
            important: response.data.important || false,
            validFrom: response.data.validFrom,
            validTo: response.data.validTo
          }
          if (this.announcementData.validFrom) {
            this.validFromDate = new Date(this.announcementData.validFrom)
            this.restrictValidFrom = true
          }
          if (this.announcementData.validTo) {
            this.validToDate = new Date(this.announcementData.validTo)
            this.restrictValidTo = true
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

      // Prepare the date entries for the API request
      if (this.restrictValidFrom) {
        this.validFromDate.setSeconds(0)
        this.announcementData.validFrom = this.validFromDate
      } else {
        this.announcementData.validFrom = undefined
      }
      if (this.restrictValidTo) {
        this.validToDate.setSeconds(0)
        this.announcementData.validTo = this.validToDate
      } else {
        this.announcementData.validTo = undefined
      }

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
