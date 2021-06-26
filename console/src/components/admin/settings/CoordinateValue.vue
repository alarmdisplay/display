<template>
    <div v-if="edit">
        <FeathersVuexFormWrapper :item="settingsItem" :eager="false">
            <template v-slot="{ clone, save }">
                <div class="level">
                    <div class="level-left">
                        <div class="level-item" style="flex-direction: column">
                            <span>Breite: <input type="number" class="input is-small" min="-90" max="90" step="0.00001" v-model.number="clone.value.latitude"></span>
                            <span>Länge: <input type="number" class="input is-small" min="-180" max="180" step="0.00001" v-model.number="clone.value.longitude"></span>
                            <ErrorMessage :form-error="formError" :short="true"/>
                        </div>
                    </div>
                    <div class="level-right">
                        <button type="button" class="button level-item is-small is-success" @click="
                        () => {
                          $data.formError = null
                          save()
                            .then(() => { $data.edit = false })
                            .catch(reason => { $data.formError = reason })
                        }"
                        >Speichern</button>
                        <button type="button" class="button level-item is-small" @click="edit = false">Abbrechen</button>
                    </div>
                </div>
            </template>
        </FeathersVuexFormWrapper>
    </div>
    <div v-else class="level">
        <div class="level-left">
            <span class="level-item">
                {{ valueText || 'nicht gesetzt' }}
            </span>
        </div>
        <div class="level-right">
            <button class="button is-small" @click.prevent="edit = true">Bearbeiten</button>
        </div>
    </div>
</template>

<script>
import ErrorMessage from '@/components/ErrorMessage'

export default {
  name: 'CoordinateValue',
  components: {
    ErrorMessage
  },
  computed: {
    settingsItem () {
      const { Setting } = this.$FeathersVuex.api
      return Setting.getFromStore(this.settingsKey)
    },
    value () {
      return this.$store.getters['settings/getCoordinateValue'](this.settingsKey)
    },
    valueText () {
      return this.value ? `${this.value.latitude}° / ${this.value.longitude}°` : null
    }
  },
  data () {
    return {
      edit: false,
      formError: null
    }
  },
  props: {
    settingsKey: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
