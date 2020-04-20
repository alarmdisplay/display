<template>
    <div class="w3-main">
        <header class="w3-container">
            <h2>Display anlegen</h2>
        </header>
        <div>
            <form class="w3-container">
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
                    <router-link to="/displays" tag="button" class="w3-btn w3-gray">Abbrechen</router-link>
                    <button id="button-create" class="w3-btn w3-blue" v-on:click="createDisplay" :disabled="!createButtonEnabled">Anlegen</button>
                </p>
            </form>
        </div>
    </div>
</template>

<script>
export default {
  name: 'DisplayEditForm',
  computed: {
    createButtonEnabled: function () {
      return this.displayName !== ''
    }
  },
  data: function () {
    return {
      displayName: '',
      clientId: '',
      active: false,
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
    }
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

    #button-create {
        float: right;
    }
</style>
