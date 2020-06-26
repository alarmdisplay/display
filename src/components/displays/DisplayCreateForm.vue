<template>
    <div>
        <header class="w3-container">
            <h2>Display anlegen</h2>
        </header>
        <div>
            <form class="w3-container" @submit.prevent="createDisplay">
                <p>
                    <label for="input-name">Name:</label>
                    <input id="input-name" type="text" class="w3-input w3-border" v-model.trim="displayName">
                </p>
                <p>
                    <label for="input-client-id">Client ID:</label>
                    <input id="input-client-id" type="text" maxlength="8" class="w3-input w3-border" v-model.trim="clientId">

                    <input id="input-active" type="checkbox" class="w3-check" v-model="active">
                    <label for="input-active">Display darf sich verbinden</label>
                </p>
                <p>
                    <label for="input-description">Beschreibung:</label>
                    <input id="input-description" type="text" class="w3-input w3-border" v-model.trim="description">
                </p>
                <p>
                    <label for="input-location">Ort:</label>
                    <input id="input-location" type="text" class="w3-input w3-border" v-model.trim="location">
                </p>
                <p>
                    <button type="button" class="w3-btn w3-gray" @click="maybeCancel">Abbrechen</button>
                    <button type="submit" class="w3-btn w3-blue" :disabled="!createButtonEnabled">Anlegen</button>
                </p>
            </form>
        </div>
    </div>
</template>

<script>
export default {
  name: 'DisplayCreateForm',
  computed: {
    createButtonEnabled: function () {
      return this.displayName !== ''
    }
  },
  data: function () {
    return {
      displayName: '',
      clientId: '',
      active: true,
      description: '',
      location: ''
    }
  },
  methods: {
    createDisplay: function () {
      this.$store.dispatch('createDisplay', {
        name: this.displayName,
        clientId: this.clientId,
        active: this.active,
        description: this.description,
        location: this.location
      })
        .then(display => {
          console.log(`Display "${display.name}" angelegt`)
          this.$router.replace({ path: '/displays' })
        }, error => {
          console.error('Fehler beim Anlegen:', error)
        })
    },
    maybeCancel: function () {
      // TODO should we ask about being sure if some fields have been filled?
      this.$router.back()
    }
  }
}
</script>

<style scoped>
    #input-client-id {
        width: unset;
    }

    button[type="submit"] {
        float: right;
    }
</style>
