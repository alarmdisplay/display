<template>
    <div v-if="edit">
        <FeathersVuexFormWrapper :item="settingsItem" :eager="false">
            <template v-slot="{ clone, save }">
                <div class="level">
                    <div class="level-left">
                        <div class="level-item" style="flex-direction: column">
                            <input type="text" class="input is-small" v-model.trim="clone.value">
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
                {{ value || '' }}
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
  name: 'StringValue',
  components: {
    ErrorMessage
  },
  computed: {
    settingsItem () {
      const { Setting } = this.$FeathersVuex.api
      return Setting.getFromStore(this.settingsKey)
    },
    value () {
      return this.$store.getters['settings/getStringValue'](this.settingsKey)
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
