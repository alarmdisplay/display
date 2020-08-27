<template>
    <form @submit.prevent="handleSubmit">
        <div class="field">
            <label class="label" for="title">
                Titel
            </label>
            <p class="control">
                <input class="input" type="text" id="title" v-model="item.title">
            </p>
        </div>
      <div class="field">
        <label class="label" for="body">
          Inhalt
        </label>
        <p class="control">
          <textarea class="textarea" id="body" v-model="item.body"></textarea>
        </p>
      </div>
        <div class="buttons is-right">
            <button class="button" type="button" @click="$emit('reset')">Zur&uuml;cksetzen</button>
            <button class="button is-success" type="submit" :disabled="!isValid()">Speichern</button>
        </div>
    </form>
</template>

<script>
export default {
  name: 'AnnouncementEditor',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    isNewItem: function () {
      return this.item.id !== undefined
    }
  },
  methods: {
    isValid: function () {
      return this.item.title !== ''
    }
  },
  setup (props, context) {
    function handleSubmit () {
      if (this.isValid()) {
        context.emit('save')
      } else {
        // TODO show validation result
      }
    }
    return { handleSubmit }
  }
}
</script>

<style scoped>

</style>
