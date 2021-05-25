<template>
  <section class="section">
    <div class="container">
      <h1 class="title">
        Alarmanzeige
      </h1>
      <p class="subtitle">
        Console
      </p>

      <ErrorMessage :form-error="errorToShow"/>

      <div class="columns">
        <div class="column is-half">
          <form @submit.prevent="login">
            <div class="field">
              <label class="label" for="email">
                E-Mail
              </label>
              <p class="control has-icons-left">
                <input class="input" type="email" id="email" v-model="email">
                <span class="icon is-small is-left">
                  <font-awesome-icon icon="envelope"/>
                </span>
              </p>
            </div>
            <div class="field">
              <label class="label" for="password">
                Passwort
              </label>
              <p class="control has-icons-left">
                <input class="input" type="password" id="password" autocomplete="current-password" v-model="password">
                <span class="icon is-small is-left">
                  <font-awesome-icon icon="lock"/>
                </span>
              </p>
            </div>
            <div class="field">
              <p class="control">
                <button :class="['button', 'is-success', { 'is-loading': isLoginPending }]" :disabled="isLoginDisabled">
                  Anmelden
                </button>
              </p>
            </div>
          </form>
        </div>
        <div class="column is-half">
          <div class="message is-info">
            <div class="message-header">
              <p>Neu hier?</p>
            </div>
            <div class="message-body">
              Wenn du das System gerade neu aufgesetzt hast, musst du erst ein Konto anlegen, um dich anmelden zu können.
              <div class="buttons is-right">
                <button type="button" class="button" @click="$store.commit('setShowSetup', true)">
                  <span>Konto anlegen</span>
                  <span class="icon">
                    <font-awesome-icon icon="chevron-right"/>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script>
import ErrorMessage from '@/components/ErrorMessage'

export default {
  name: 'Login',
  components: {
    ErrorMessage
  },
  computed: {
    errorToShow () {
      const errorToShow = this.loginError ? this.loginError : this.$store.state.auth.errorOnAuthenticate

      if (errorToShow) {
        if (errorToShow.message === 'No accessToken found in storage' || errorToShow.message.includes('expired')) {
          // Not really an error, there is just no valid session token in local storage
          return undefined
        } else if (errorToShow.message === 'Invalid login') {
          errorToShow.message = 'Zugangsdaten ungültig'
        } else if (errorToShow.message.includes('Timeout')) {
          errorToShow.message = 'Zeitüberschreitung'
        }
      }

      return errorToShow
    },
    isFormValid () {
      return /^[^@]+@[^@]+$/.test(this.email) && this.password !== ''
    },
    isLoginDisabled () {
      return !this.$store.state.socket.connected || !this.isFormValid || this.isLoginPending
    },
    isLoginPending () {
      return this.$store.state.auth.isAuthenticatePending
    }
  },
  data () {
    return {
      loginError: null,
      email: '',
      password: ''
    }
  },
  methods: {
    login: function () {
      this.loginError = null
      this.$store.dispatch('auth/authenticate', { email: this.email, password: this.password, strategy: 'local' })
        .catch(reason => { this.loginError = reason })
    }
  }
}
</script>

<style scoped>

</style>
