<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Ansicht bearbeiten</h1>

      <div class="buttons is-left">
        <BackButton/>
      </div>

      <ErrorMessage :form-error="formError"/>

      <FeathersVuexFormWrapper v-if="viewToEdit" :item="viewToEdit" watch>
        <template v-slot="{ clone, save, reset }">
          <ViewEditForm
            :item="clone"
            @save="(contentSlots) => handleSave(save, contentSlots)"
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
    viewId () {
      if (this.$route.params.view_id === 'new') {
        return 'new'
      }

      return parseInt(this.$route.params.view_id)
    },
    viewToEdit () {
      const { View } = this.$FeathersVuex.api
      // Get the View for the given ID or create a new one if the ID is 'new'
      return this.viewId === 'new' ? new View() : View.getFromStore(this.viewId)
    }
  },
  data () {
    return {
      formError: null
    }
  },
  methods: {
    handleSave (save, contentSlots) {
      this.formError = null
      save()
        .then(() => {
          console.log('content slots:', contentSlots)
          console.log('original content slots:', this.viewToEdit.contentSlots)
          const contentSlotIdsToSave = contentSlots.filter(contentSlot => contentSlot.id !== undefined).map(contentSlot => contentSlot.id)
          console.log('Saving the Content Slots', contentSlotIdsToSave)

          const removedContentSlots = this.viewToEdit.contentSlots.filter(contentSlot => {
            if (contentSlot.__isTemp) {
              return false
            }

            return !contentSlotIdsToSave.includes(contentSlot.id)
          })
          console.log('removed', removedContentSlots)
          removedContentSlots.forEach(contentSlot => contentSlot.remove())

          // Save the remaining content slots
          contentSlots.forEach(contentSlot => contentSlot.save())
        })
        .then(() => this.$router.push({ name: 'view-list', params: { display_id: `${this.displayId}` } }))
        .catch(reason => { this.formError = reason })
    }
  },
  watch: {
    viewId: {
      handler (value) {
        if (value === 'new') {
          return
        }
        const { View } = this.$FeathersVuex.api
        const existingRecord = View.getFromStore(value)

        // If the record was not in the store, we have to fetch it from the server
        if (!existingRecord) {
          View.get(value)
        }
      },
      immediate: true // Run this handler when the component is created
    }
  }
}
</script>

<style scoped>

</style>
