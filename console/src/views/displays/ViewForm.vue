<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Ansicht bearbeiten</h1>

      <div class="buttons is-left">
        <BackButton/>
      </div>

      <ErrorMessage :form-error="formError"/>

      <ViewEditForm
          v-if="viewToEdit"
          :item="viewToEdit"
          @save="handleSave"
          @reset="viewToEdit.reset()"
      ></ViewEditForm>
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
    viewId () {
      if (this.$route.params.view_id === 'new') {
        return 'new'
      }

      return parseInt(this.$route.params.view_id)
    }
  },
  data () {
    return {
      formError: null,
      viewToEdit: null
    }
  },
  methods: {
    cloneWithAssociations (clonedView) {
      console.log('clone it', clonedView)
      clonedView.contentSlots = clonedView.contentSlots.map(contentSlot => contentSlot.clone())
      return clonedView
    },
    async handleSave () {
      console.log('about to save', this.viewToEdit)
      this.formError = null
      try {
        const result = await this.viewToEdit.save()

        // refresh the View from the server
        const { View } = this.$FeathersVuex.api
        await View.get(result.id)

        await this.$router.push({ name: 'view-list', params: { display_id: `${this.displayId}` } })
      } catch (reason) {
        this.formError = reason
      }
    }
  },
  watch: {
    viewId: {
      async handler (value) {
        console.log('setting viewToEdit...')
        const { View } = this.$FeathersVuex.api
        if (value === 'new') {
          this.viewToEdit = new View()
          this.viewToEdit.displayId = this.displayId
          return
        }

        let existingRecord = View.getFromStore(value)

        // If the record was not in the store, we have to fetch it from the server
        if (!existingRecord) {
          existingRecord = await View.get(value)
        }

        this.viewToEdit = existingRecord.clone()
        this.viewToEdit.contentSlots = this.viewToEdit.contentSlots.map(contentSlot => {
          const clone = contentSlot.clone()
          clone.options = clone.options.map(option => option.clone())
          return clone
        })
      },
      immediate: true // Run this handler when the component is created
    }
  }
}
</script>

<style scoped>

</style>
