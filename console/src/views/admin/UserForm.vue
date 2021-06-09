<template>
    <section class="section">
        <div class="container">
            <h1 class="title">Konto {{ id === 'new' ? 'anlegen' : 'bearbeiten' }}</h1>

            <div class="buttons is-left">
                <BackButton/>
            </div>

            <ErrorMessage :form-error="formError"/>

            <FeathersVuexFormWrapper :item="item" :eager="false">
                <template v-slot="{ clone, save, reset }">
                    <UserEditor
                        :item="clone"
                        @save="
                        () => {
                          $data.formError = null
                          save()
                            .then(() => $router.push({name: 'user-list'}))
                            .catch(reason => { $data.formError = reason })
                        }"
                        @reset="reset"
                    ></UserEditor>
                </template>
            </FeathersVuexFormWrapper>
        </div>
    </section>
</template>

<script>
import UserEditor from '@/components/admin/UserEditor'
import BackButton from '@/components/BackButton'
import ErrorMessage from '@/components/ErrorMessage'

export default {
  name: 'UserForm',
  components: { ErrorMessage, BackButton, UserEditor },
  computed: {
    id () {
      return this.$route.params.id
    },
    item () {
      const { User } = this.$FeathersVuex.api
      // Get the User for the given ID or create a new one if the ID is 'new'
      return this.id === 'new' ? new User() : User.getFromStore(this.id)
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
        const { User } = this.$FeathersVuex.api
        const existingRecord = User.getFromStore(value)

        // If the record was not in the store, we have to fetch it from the server
        if (!existingRecord) {
          User.get(value)
        }
      },
      immediate: true // Run this handler when the component is created
    }
  }
}
</script>
