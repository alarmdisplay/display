<template>
    <section class="section">
        <div class="container">
            <h1 class="title">Display {{ id === 'new' ? 'anlegen' : 'bearbeiten' }}</h1>

            <div class="buttons is-left">
                <BackButton/>
            </div>

            <ErrorMessage :form-error="formError"/>

            <FeathersVuexFormWrapper :item="item" watch>
                <template v-slot="{ clone, save, reset }">
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
      // Get the Display for the given ID or create a new one if the ID is 'new'
      return this.id === 'new' ? new Display() : Display.getFromStore(this.id)
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
        if (value === 'new') {
          return
        }
        const { Display } = this.$FeathersVuex.api
        const existingRecord = Display.getFromStore(value)

        // If the record was not in the store, we have to fetch it from the server
        if (!existingRecord) {
          Display.get(value)
        }
      },
      immediate: true // Run this handler when the component is created
    }
  }
}
</script>
