<template>
    <div>
        <header class="w3-container">
            <h2>Ank&uuml;ndigung anlegen</h2>
        </header>
        <div>
            <form class="w3-container">
                <p>
                    <label for="input-title">Titel:</label>
                    <input id="input-title" type="text" class="w3-input w3-border" v-model.trim="title">
                </p>
                <p>
                    <label for="textarea-text">Text:</label>
                    <textarea id="textarea-text" class="w3-input w3-border" v-model.trim="text"></textarea>
                </p>
                <p>
                    <button class="w3-btn w3-gray" @click="maybeCancel">Abbrechen</button>
                    <button id="button-create" class="w3-btn w3-blue" v-on:click="createAnnouncement" :disabled="!createButtonEnabled">Anlegen</button>
                </p>
            </form>
        </div>
    </div>
</template>

<script>
export default {
  name: 'AnnouncementCreateForm',
  computed: {
    createButtonEnabled: function () {
      return this.text !== ''
    }
  },
  data: function () {
    return {
      title: '',
      text: '',
      important: false
    }
  },
  methods: {
    createAnnouncement: function () {
      this.$store.dispatch('createAnnouncement', {
        title: this.title,
        text: this.text,
        important: this.important
      })
        .then(() => {
          this.$router.replace({ path: '/announcements' })
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
