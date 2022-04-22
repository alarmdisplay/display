<template>
    <form @submit.prevent="handleSubmit">
        <div class="field is-horizontal">
            <div class="field-label is-normal">
                <label class="label" for="name">
                    Name
                </label>
            </div>
            <div class="field-body">
                <div class="field">
                    <div class="control">
                        <input class="input" type="text" id="name" v-model="item.name">
                    </div>
                    <p class="help">
                        Vergebe einen eindeutigen Namen
                    </p>
                </div>
            </div>
        </div>

        <div class="field is-horizontal">
            <div class="field-label is-normal">
                <label class="label" for="url">
                    URL
                </label>
            </div>
            <div class="field-body">
                <div class="field">
                    <div class="control">
                        <input class="input" type="url" id="url" v-model="item.url">
                    </div>
                </div>
            </div>
        </div>

        <div class="buttons is-right">
            <button class="button" type="button" @click="$emit('reset')">Zur&uuml;cksetzen</button>
            <button class="button is-success" type="submit" :disabled="!isValid()">Speichern</button>
        </div>
    </form>
</template>

<script>
export default {
  name: 'CalendarFeedForm',
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
      return this.item.name !== '' && this.item.url !== '';
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
