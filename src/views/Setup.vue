<template>
  <section class="section">
    <div class="container">
      <h1 class="title">
        Alarmanzeige
      </h1>
      <h2 class="subtitle">Erste Einrichtung</h2>

      <div class="buttons is-link">
        <button type="button" class="button" @click="$store.commit('setShowSetup', false)">
          <span class="icon">
            <font-awesome-icon icon="chevron-left"/>
          </span>
          <span>Zurück zum Login</span>
        </button>
      </div>

      <ErrorMessage :form-error="createError"/>

      <div class="columns">
        <div class="column is-half">
          <div class="message is-info">
            <div class="message-header">
              <p>Erstes Konto anlegen</p>
            </div>
            <div class="message-body">
              Bevor du loslegen kannst, musst du ein Konto anlegen.
              Nur das erste Konto kann hier angelegt werden, alle weiteren Konten legst du nach dem Login an.
            </div>
          </div>
        </div>
        <div class="column is-half">
          <form @submit.prevent="createUser">
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
                <input class="input" type="password" id="password" autocomplete="new-password" v-model="password">
                <span class="icon is-small is-left">
              <font-awesome-icon icon="lock"/>
            </span>
              </p>
            </div>
            <div class="field">
              <div class="control">
                <div class="buttons is-right">
                  <button class="button is-success" :disabled="email === '' || password === ''">
                    Konto anlegen
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ErrorMessage from '@/components/ErrorMessage'
export default {
  name: 'Setup',
  components: {
    ErrorMessage
  },
  data () {
    return {
      createError: null,
      email: '',
      password: ''
    }
  },
  methods: {
    createUser: function () {
      this.$store.dispatch('users/create', { email: this.email, password: this.password })
        .then(() => this.$store.dispatch('auth/authenticate', { email: this.email, password: this.password, strategy: 'local' }))
        .then(() => this.$store.commit('setShowSetup', false))
        .catch(reason => {
          this.createError = reason
          if (this.createError.message === 'Not authenticated') {
            this.createError.message = 'Du bist nicht berechtigt, ein neues Konto anzulegen. Frage eine Person mit einem Zugang, dir ein Konto anzulegen.'
          }
        })
    }
  }
}
</script>

<style scoped>

</style>
