<template>
    <section class="section">
        <div class="container">
            <h1 class="title">Bekanntmachung {{ id === 'new' ? 'anlegen' : 'bearbeiten' }}</h1>

            <div class="buttons is-left">
                <BackButton/>
            </div>

            <ErrorMessage :form-error="formError"/>

            <FeathersVuexFormWrapper :item="item" watch>
                <template v-slot="{ clone, save, reset }">
                    <AnnouncementEditor
                        :item="clone"
                        @save="
                        () => {
                          $data.formError = null
                          save()
                            .then(() => $router.push({name: 'announcement-list'}))
                            .catch(reason => { $data.formError = reason })
                        }"
                        @reset="reset"
                    ></AnnouncementEditor>
                </template>
            </FeathersVuexFormWrapper>
        </div>
    </section>
</template>

<script>
import BackButton from '@/components/BackButton'
import ErrorMessage from '@/components/ErrorMessage'
import AnnouncementEditor from '@/components/content/AnnouncementEditor'

export default {
  name: 'AnnouncementForm',
  components: { AnnouncementEditor, ErrorMessage, BackButton },
  computed: {
    id () {
      return this.$route.params.id
    },
    item () {
      const { Announcement } = this.$FeathersVuex.api
      // Get the Announcement for the given ID or create a new one if the ID is 'new'
      return this.id === 'new' ? new Announcement() : Announcement.getFromStore(this.id)
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
        const { Announcement } = this.$FeathersVuex.api
        const existingRecord = Announcement.getFromStore(value)

        // If the record was not in the store, we have to fetch it from the server
        if (!existingRecord) {
          Announcement.get(value)
        }
      },
      immediate: true // Run this handler when the component is created
    }
  }
}
</script>
