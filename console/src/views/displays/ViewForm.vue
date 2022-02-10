<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Ansicht bearbeiten</h1>

      <div class="buttons is-left">
        <BackButton/>
      </div>

      <ErrorMessage :form-error="formError"/>

      <FeathersVuexFormWrapper :item="item" :eager="false">
        <template v-slot="{ clone, save, reset }">
          <ViewEditForm
              :item="clone"
              @save="
              () => {
                $data.formError = null
                save()
                  .then(() => $router.push({ name: 'view-list', params: { display_id: `${displayId}` } }))
                  .catch(reason => { $data.formError = reason })
              }"
              @reset="reset"
          ></ViewEditForm>
        </template>
      </FeathersVuexFormWrapper>
    </div>
  </section>
</template>

<script>
import BackButton from '@/components/BackButton'
import ErrorMessage from '@/components/ErrorMessage'
import ViewEditForm from '@/components/views/ViewEditForm'
export default {
  name: 'ViewForm',
  components: {
    ViewEditForm,
    BackButton,
    ErrorMessage
  },
  computed: {
    displayId () {
      return parseInt(this.$route.params.display_id)
    },
    item () {
      const { View } = this.$FeathersVuex.api
      // Get the View for the given ID or create a new one if the ID is 'new'
      return this.viewId === 'new' ? this.newItem : View.getFromStore(this.viewId)
    },
    viewId () {
      if (this.$route.params.view_id === 'new') {
        return 'new'
      }

      return parseInt(this.$route.params.view_id)
    }
  },
  data () {
    const { View } = this.$FeathersVuex.api
    return {
      formError: null,
      newItem: new View({ displayId: this.displayId })
    }
  },
  watch: {
    viewId: {
      async handler (value) {
        if (value === 'new') {
          return
        }

        const { View } = this.$FeathersVuex.api
        const existingRecord = View.getFromStore(value)

        // If the record was not in the store, we have to fetch it from the server
        if (!existingRecord) {
          await View.get(value)
        }
      },
      immediate: true // Run this handler when the component is created
    }
  }
}
</script>

<style scoped>

</style>
