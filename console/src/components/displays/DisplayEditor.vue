<template>
    <form @submit.prevent="handleSubmit">
        <div class="field">
            <label class="label" for="name">
                Name
            </label>
            <p class="control">
                <input class="input" type="text" id="name" v-model="item.name">
            </p>
        </div>
      <div class="field">
        <label class="label" for="description">
          Beschreibung
        </label>
        <p class="control">
          <input class="input" type="text" id="description" v-model="item.description">
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
  name: 'DisplayEditor',
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
      return this.item.name !== ''
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
