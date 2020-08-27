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
            <label class="label" for="email">
                E-Mail
            </label>
            <p class="control">
                <input class="input" type="email" id="email" v-model="item.email">
            </p>
        </div>
        <div class="field" v-if="!isNewItem">
            <label class="label" for="password">
                Passwort
            </label>
            <p class="control">
                <input class="input" type="password" id="password" autocomplete="new-password" v-model="item.password">
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
  name: 'UserEditor',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    isNewItem () {
      return this.item.id !== undefined
    }
  },
  methods: {
    isValid () {
      return (this.item.password !== '' || this.isNewItem) && this.item.email !== ''
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
