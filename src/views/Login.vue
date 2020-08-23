<template>
  <section class="section">
    <div class="container">
      <h1 class="title">
        Display Console
      </h1>
      <p class="subtitle">
        Bitte einloggen
      </p>

      <ErrorMessage :form-error="loginError"/>

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
                <button class="button is-success" :disabled="email === '' || password === ''">
                  Login
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
              Wenn du das System gerade neu aufgesetzt hast, musst du erst ein Konto anlegen, um dich einloggen zu können.
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
  data () {
    return {
      loginError: null,
      email: '',
      password: ''
    }
  },
  methods: {
    login: function () {
      this.$store.dispatch('auth/authenticate', { email: this.email, password: this.password, strategy: 'local' })
        .catch(reason => { this.loginError = reason })
    }
  }
}
</script>

<style scoped>

</style>
