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
        <div class="field">
            <label class="label" for="validFrom">
                Anzeigen ab
            </label>
            <p v-if="useValidFrom" class="control">
                <DateTimePicker id="validFrom" v-model="item.validFrom" />
                <button type="button" class="button" @click="clearValidFrom">Datum entfernen</button>
            </p>
            <p v-else class="control">
                <button type="button" class="button" @click="setValidFrom">Datum setzen</button>
            </p>
            <p class="help">
                Optionale Angabe, ab wann die Bekanntmachung angezeigt werden soll.
            </p>
        </div>
        <div class="field">
            <label class="label" for="validTo">
                Anzeigen bis
            </label>
            <p v-if="useValidTo" class="control">
                <DateTimePicker id="validTo" v-model="item.validTo" />
                <button type="button" class="button" @click="clearValidTo">Datum entfernen</button>
            </p>
            <p v-else class="control">
                <button type="button" class="button" @click="setValidTo">Datum setzen</button>
            </p>
            <p class="help">
                Optionale Angabe, bis wann die Bekanntmachung angezeigt werden soll.
            </p>
        </div>
        <div class="buttons is-right">
            <button class="button" type="button" @click="$emit('reset')">Zur&uuml;cksetzen</button>
            <button class="button is-success" type="submit" :disabled="!isValid()">Speichern</button>
        </div>
    </form>
</template>

<script>
import DateTimePicker from '@/components/DateTimePicker.vue'

const defaultOffset = 7 * 86400 * 1000 // 7 days in milliseconds
export default {
  name: 'AnnouncementEditor',
  components: {
    DateTimePicker,
  },
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
  data() {
    return {
      useValidFrom: this.item.validFrom instanceof Date,
      useValidTo: this.item.validTo instanceof Date,
    }
  },
  methods: {
    clearValidFrom() {
      this.useValidFrom = false;
      this.item.validFrom = null;
    },
    clearValidTo() {
      this.useValidTo = false;
      this.item.validTo = null;
    },
    isValid: function () {
      return this.item.title !== ''
    },
    setValidTo() {
      this.item.validTo = new Date((this.item.validFrom || new Date()).valueOf() + defaultOffset);
      this.useValidTo = true;
    },
    setValidFrom() {
      this.item.validFrom = new Date();
      this.useValidFrom = true;
    },
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
