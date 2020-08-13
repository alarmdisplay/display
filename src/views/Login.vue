<template>
    <section class="section">
        <div class="container">
            <h1 class="title">
                Login
            </h1>
            <p class="subtitle">
                Bitte einloggen
            </p>
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
                        <button class="button is-success">
                            Login
                        </button>
                    </p>
                </div>
            </form>
        </div>
    </section>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    login: function () {
      this.$store.dispatch('auth/authenticate', { email: this.email, password: this.password, strategy: 'local' })
    }
  }
}
</script>

<style scoped>

</style>
