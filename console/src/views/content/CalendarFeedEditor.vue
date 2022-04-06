<template>
    <section class="section">
        <div class="container">
            <h1 class="title">Kalender-Abonnement {{ feedId === 'new' ? 'anlegen' : 'bearbeiten' }}</h1>

            <div class="buttons is-left">
                <BackButton/>
            </div>

            <ErrorMessage :form-error="formError"/>

            <FeathersVuexFormWrapper :item="item" watch>
                <template v-slot="{ clone, save, reset }">
                    <CalendarFeedForm
                        :item="clone"
                        @save="
                        () => {
                          $data.formError = null
                          save()
                            .then(() => $router.push({name: 'calendars'}))
                            .catch(reason => { $data.formError = reason })
                        }"
                        @reset="reset"
                    ></CalendarFeedForm>
                </template>
            </FeathersVuexFormWrapper>
        </div>
    </section>
</template>

<script>
import BackButton from '@/components/BackButton'
import CalendarFeedForm from '@/components/content/CalendarFeedForm'
import ErrorMessage from '@/components/ErrorMessage'

export default {
  name: 'CalendarFeedEditor',
  components: { BackButton, CalendarFeedForm, ErrorMessage },
  props: {
    feedId: {
      type: [Number, String],
      required: true,
    }
  },
  data() {
    const { CalendarFeed } = this.$FeathersVuex.api
    return {
      formError: null,
      newItem: new CalendarFeed()
    };
  },
  computed: {
    item () {
      const { CalendarFeed } = this.$FeathersVuex.api
      // Get the CalendarFeed for the given ID or create a new one if the ID is 'new'
      return this.feedId === 'new' ? this.newItem : CalendarFeed.getFromStore(this.feedId)
    },
  },
}
</script>

<style scoped>

</style>
