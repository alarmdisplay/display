<template>
    <section class="section">
        <div class="container">
            <h1 class="title">API-Key {{ id === 'new' ? 'anlegen' : 'bearbeiten' }}</h1>

            <div class="buttons is-left">
                <BackButton/>
            </div>

            <ErrorMessage :form-error="formError"/>

            <FeathersVuexFormWrapper :item="item" watch>
                <template v-slot="{ clone, save, reset }">
                    <ApiKeyEditor
                        :item="clone"
                        @save="
                        () => {
                          $data.formError = null
                          save()
                            .then(() => $router.push({name: 'api-key-list'}))
                            .catch(reason => { $data.formError = reason })
                        }"
                        @reset="reset"
                    ></ApiKeyEditor>
                </template>
            </FeathersVuexFormWrapper>
        </div>
    </section>
</template>

<script>
import ApiKeyEditor from '@/components/admin/ApiKeyEditor'
import BackButton from '@/components/BackButton'
import ErrorMessage from '@/components/ErrorMessage'
export default {
  name: 'ApiKeyForm',
  components: { BackButton, ApiKeyEditor, ErrorMessage },
  computed: {
    id () {
      return this.$route.params.id
    },
    item () {
      const { ApiKey } = this.$FeathersVuex.api
      // Get the API key for the given ID or create a new one if the ID is 'new'
      return this.id === 'new' ? new ApiKey() : ApiKey.getFromStore(this.id)
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
        const { ApiKey } = this.$FeathersVuex.api
        const existingRecord = ApiKey.getFromStore(value)

        // If the record was not in the store, we have to fetch it from the server
        if (!existingRecord) {
          ApiKey.get(value)
        }
      },
      immediate: true // Run this handler when the component is created
    }
  }
}
</script>
