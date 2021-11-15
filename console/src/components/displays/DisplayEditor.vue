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
                </div>
            </div>
        </div>

        <div class="field is-horizontal">
            <div class="field-label is-normal">
                <label class="label" for="description">
                    Beschreibung
                </label>
            </div>
            <div class="field-body">
                <div class="field">
                    <div class="control">
                        <input class="input" type="text" id="description" v-model="item.description">
                    </div>
                </div>
            </div>
        </div>

        <div class="field is-horizontal">
            <div class="field-label is-normal">
                <label class="label" for="type">Typ</label>
            </div>
            <div class="field-body">
                <div class="field">
                    <div class="control has-icons-left">
                        <div class="select">
                            <select id="type" v-model="item.type">
                                <option value="monitor">Monitor</option>
                                <option value="tablet">Tablet</option>
                            </select>
                        </div>
                        <div class="icon is-small is-left">
                            <DisplayIcon :display="item"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="level mt-5">
            <div class="level-left">
                <div class="buttons">
                    <button class="button level-item is-danger is-outlined" v-if="!isNewItem" type="button" @click="$emit('remove')">Löschen</button>
                </div>
            </div>
            <div class="level-right">
                <div class="buttons">
                    <button class="button level-item" type="button" @click="$emit('reset')">Zur&uuml;cksetzen</button>
                    <button class="button level-item is-success" type="submit" :disabled="!isValid()">Speichern</button>
                </div>
            </div>
        </div>
    </form>
</template>

<script>
import DisplayIcon from '@/components/DisplayIcon'
export default {
  name: 'DisplayEditor',
  components: { DisplayIcon },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    isNewItem: function () {
      return this.item.id === undefined
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
/* Give the icon in the dropdown a less light color */
.control.has-icons-left .icon {
    color: unset;
}
</style>
