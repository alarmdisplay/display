<template>
    <section class="section">
        <div class="container">
            <h1 class="title">Konten</h1>

            <div class="buttons">
                <router-link tag="button" type="button" class="button" to="new" append>
                    <span class="icon"><font-awesome-icon icon="user-plus"/></span>
                    <span>Konto anlegen</span>
                </router-link>
            </div>

            <FeathersVuexFind service="users" :query="{ $limit: 50 }" qid="userList" watch="query">
                <table class="table is-fullwidth" slot-scope="{ items: users }">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Angelegt am</th>
                        <th>Aktionen</th>
                    </tr>
                    </thead>
                    <tbody>
                    <template v-for="user in users">
                        <tr :key="user.id">
                            <th>{{ user.name }}</th>
                            <td>{{ user.email }}</td>
                            <td>{{ user.createdAt | moment('LL') }}</td>
                            <td class="is-narrow">
                                <div class="field is-grouped">
                                    <p class="control">
                                        <button class="button is-outlined" title="Konto bearbeiten" @click="$router.push({ name: 'user-form', params: { id: user.id } })">
                                            <span class="icon">
                                                <font-awesome-icon icon="user-edit"/>
                                            </span>
                                            <span>Bearbeiten</span>
                                        </button>
                                    </p>
                                    <p class="control">
                                        <button class="button is-danger is-outlined" title="Konto entfernen" :disabled="user.id === $store.getters['auth/user'].id" @click="removeUser(user.id)">
                                            <span class="icon">
                                                <font-awesome-icon icon="user-minus"/>
                                            </span>
                                        </button>
                                    </p>
                                </div>
                            </td>
                        </tr>
                    </template>
                    </tbody>
                </table>
            </FeathersVuexFind>
        </div>
    </section>
</template>

<script>
export default {
  name: 'UserList',
  methods: {
    removeUser: function (id) {
      if (!id) {
        return
      }

      this.$store.dispatch('users/remove', id)
    }
  }
}
</script>

<style scoped>

</style>
