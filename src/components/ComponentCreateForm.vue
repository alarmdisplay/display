<template>
    <div>
        <header class="w3-container">
            <h2>Komponente anlegen</h2>
        </header>
        <div>
            <form class="w3-container">
                <p>
                    <label for="input-name">Name:</label>
                    <input id="input-name" type="text" class="w3-input w3-border" v-model.trim="displayName">
                </p>
                <p>
                    <label for="select-type">Typ:</label>
                    <select id="select-type" class="w3-select" v-model="type">
                        <option value="" disabled selected>Bitte wählen</option>
                        <option value="AnnouncementList">Ankündigungen</option>
                        <option value="DWDWarningsMap">DWD-Warnkarte</option>
                        <option value="Clock">Uhr</option>
                    </select>
                </p>
                <p>
                    <button class="w3-btn w3-gray" @click="maybeCancel">Abbrechen</button>
                    <button id="button-create" class="w3-btn w3-blue" v-on:click="createComponent" :disabled="!createButtonEnabled">Anlegen</button>
                </p>
            </form>
        </div>
    </div>
</template>

<script>
export default {
  name: 'ComponentCreateForm',
  computed: {
    createButtonEnabled: function () {
      return this.displayName !== '' && this.type !== ''
    }
  },
  data: function () {
    return {
      displayName: '',
      type: ''
    }
  },
  methods: {
    createComponent: function () {
      this.$store.dispatch('createComponent', {
        name: this.displayName,
        type: this.type
      })
        .then(component => {
          console.log(`Komponente "${component.name}" angelegt`)
          this.$router.replace({ path: '/components' })
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
    #button-create {
        float: right;
    }
</style>
