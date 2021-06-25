<template>
    <span v-if="formError && short" class="has-text-danger">
        {{ messages[0] || 'Fehler' }}
    </span>
    <article class="message is-danger" v-else-if="formError">
        <div class="message-header">
            Fehler
        </div>
        <div class="message-body">
            <ul>
                <li v-for="[index, message] in messages.entries()" :key="index">
                    {{ message }}
                </li>
            </ul>
        </div>
    </article>
</template>
<script>
export default {
  name: 'ErrorMessage',
  computed: {
    messages: function () {
      if (this.formError.type === 'FeathersError') {
        if (this.formError.errors.length > 0) {
          return this.formError.errors.map(error => error.message)
        } else {
          return [this.formError.message]
        }
      }

      return [this.formError.toString()]
    }
  },
  props: {
    formError: Object,
    short: Boolean
  }
}
</script>
