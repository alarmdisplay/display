<template>
    <section class="section">
        <div class="container">
            <h1 class="title">Display {{ id === 'new' ? 'anlegen' : 'bearbeiten' }}</h1>

            <div class="buttons is-left">
                <BackButton/>
            </div>

            <ErrorMessage :form-error="formError"/>

            <FeathersVuexFormWrapper v-if="item" :item="item" :watch="false" :eager="false">
                <template v-slot="{ clone, save, reset, remove }">
                    <DisplayEditor
                        :item="clone"
                        @save="
                        () => {
                          $data.formError = null
                          save()
                            .then(() => $router.push({name: 'display-list'}))
                            .catch(reason => { $data.formError = reason })
                        }"
                        @reset="reset"
                        @remove="
                        () => {
                          $data.formError = null
                          remove()
                            .then(() => $router.push({name: 'display-list'}))
                            .catch(reason => { $data.formError = reason })
                        }"
                    ></DisplayEditor>
                </template>
            </FeathersVuexFormWrapper>
        </div>
    </section>
</template>

<script>
import BackButton from '@/components/BackButton'
import ErrorMessage from '@/components/ErrorMessage'
import DisplayEditor from '@/components/displays/DisplayEditor'

export default {
  name: 'DisplayForm',
  components: { DisplayEditor, ErrorMessage, BackButton },
  computed: {
    id () {
      return this.$route.params.id
    },
    item () {
      const { Display } = this.$FeathersVuex.api
      return Display.getFromStore(this.id)
    }
  },
  data () {
    return {
      formError: null
    }
  },
  watch: {
    id: {
      handler (value) {
        const displayId = Number.parseInt(value)
        if (isNaN(displayId)) {
          return
        }
        const { Display } = this.$FeathersVuex.api
        const existingRecord = Display.getFromStore(displayId)

        // If the record was not in the store, we have to fetch it from the server
        if (!existingRecord) {
          Display.get(displayId)
        }
      },
      immediate: true // Run this handler when the component is created
    }
  }
}
</script>
