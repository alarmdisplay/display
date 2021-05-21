<template>
    <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a role="button" ref="hamburger" class="navbar-burger burger" aria-label="menu" aria-expanded="false" @click.prevent="toggleMenu">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <div ref="navbarmenu" class="navbar-menu">
            <div class="navbar-start">
                <router-link class="navbar-item is-tab" to="/" exact>
                    <span class="icon"><font-awesome-icon icon="home"/></span>
                    <span>&Uuml;bersicht</span>
                </router-link>

                <router-link class="navbar-item is-tab" :to="{ name: 'display-list' }">
                    <span class="icon"><font-awesome-icon icon="desktop"/></span>
                    <span>Displays</span>
                </router-link>

                <router-link class="navbar-item is-tab" :to="{ name: 'announcement-list' }">
                    <span class="icon"><font-awesome-icon icon="bullhorn"/></span>
                    <span>Ank&uuml;ndigungen</span>
                </router-link>
            </div>

            <div class="navbar-end">
                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">
                        <span class="icon"><font-awesome-icon icon="wrench"/></span>
                        <span>Administration</span>
                    </a>

                    <div class="navbar-dropdown">
                        <router-link tag="a" class="navbar-item" to="/admin/users">
                            <span class="icon"><font-awesome-icon icon="user"/></span>
                            <span>Konten</span>
                        </router-link>
                        <router-link tag="a" class="navbar-item" to="/admin/api-keys">
                            <span class="icon"><font-awesome-icon icon="key"/></span>
                            <span>API-Keys</span>
                        </router-link>
                    </div>
                </div>

                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">
                        <span class="icon"><font-awesome-icon icon="question-circle"/></span>
                        <span>Hilfe</span>
                    </a>

                    <div class="navbar-dropdown">
                        <router-link tag="a" class="navbar-item" to="/about">
                            <span class="icon"><font-awesome-icon icon="info-circle"/></span>
                            <span>&Uuml;ber</span>
                        </router-link>
                    </div>
                </div>

                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">
                        <span class="icon"><font-awesome-icon icon="user"/></span>
                        <span>{{ displayName }}</span>
                    </a>

                    <div class="navbar-dropdown">
                        <a class="navbar-item" @click="logout">
                            <span class="icon"><font-awesome-icon icon="sign-out-alt"/></span>
                            <span>Logout</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
  name: 'Navbar',
  computed: {
    displayName: function () {
      const currentUser = this.$store.getters['auth/user']
      if (!currentUser) {
        return 'Nicht eingeloggt'
      }

      return currentUser.displayName || '???'
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('auth/logout')
        .then(() => {
          // Reload the page to clear the data store
          window.location.reload()
        })
    },
    toggleMenu: function () {
      this.$refs.hamburger.classList.toggle('is-active')
      this.$refs.navbarmenu.classList.toggle('is-active')
    }
  }
}
</script>

<style scoped>

</style>
