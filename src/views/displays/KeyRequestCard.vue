<template>
  <div class="card">
    <div class="card-content">
      <div class="media">
        <div class="media-left has-text-centered" style="align-self: center">
          <font-awesome-icon icon="desktop" size="2x"/>
          <p class="has-text-weight-bold">{{ keyRequest.requestId }}</p>
        </div>
        <div class="media-content">
          <div class="control">
            <label class="label sr-only" :for="inputId">Name für das neue Display</label>
            <input type="text" class="input" :id="inputId" ref="newDisplayName" placeholder="Name" v-model.trim="newName">
            <p class="help">Der Name für das neue Display.</p>
          </div>
        </div>
        <div class="media-right">
          <div class="buttons">
            <button type="button" class="button" @click="keyRequest.remove()">Ignorieren</button>
            <button type="button" class="button is-success" @click="acceptRequest" :disabled="newName === ''">Freischalten</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'KeyRequestCard',
  computed: {
    inputId () {
      return `new-display-name-${this.keyRequest.requestId}`
    }
  },
  data () {
    return {
      newName: ''
    }
  },
  methods: {
    acceptRequest () {
      const input = this.$refs.newDisplayName
      input.classList.remove('is-danger')
      if (this.newName === '') {
        input.classList.add('is-danger')
        return
      }

      const clone = this.keyRequest.clone()
      clone.name = this.newName
      clone.granted = true
      clone.save()
    }
  },
  props: {
    keyRequest: Object
  }
}
</script>
