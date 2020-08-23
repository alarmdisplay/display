<template>
    <section class="section">
        <div class="container">
            <h1 class="title">API-Keys</h1>

            <div class="buttons">
                <router-link tag="button" type="button" class="button" to="new" append>
                    <span class="icon"><font-awesome-icon icon="plus"/></span>
                    <span>API-Key erzeugen</span>
                </router-link>
            </div>

            <div class="notification is-success" v-if="createdApiKey">
                <button class="delete" @click="$store.commit('api-keys/clearCreatedApiKey')"></button>
                <p><strong>API-Key erzeugt</strong></p>
                <p class="is-family-code">{{ createdApiKey }}</p>
                <p>Dieser Key kann später nicht erneut angezeigt werden und sollte deshalb sofort notiert und sicher verwahrt werden.</p>
            </div>

            <FeathersVuexFind service="api-keys" :query="{ displayId: null, $limit: 50 }" qid="apiKeyList" watch="query">
                <table class="table is-fullwidth" slot-scope="{ items: apiKeys }">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Angelegt am</th>
                        <th>Aktionen</th>
                    </tr>
                    </thead>
                    <tbody>
                    <template v-for="apiKey in apiKeys">
                        <tr :key="apiKey.id">
                            <th>{{ apiKey.name }}</th>
                            <td>{{ apiKey.createdAt | moment('LL') }}</td>
                            <td class="is-narrow">
                                <div class="field is-grouped">
                                    <p class="control">
                                        <button class="button is-outlined" title="API-Key bearbeiten" @click="$router.push({ name: 'api-key-form', params: { id: apiKey.id } })">
                                            <span class="icon">
                                                <font-awesome-icon icon="edit"/>
                                            </span>
                                            <span>Bearbeiten</span>
                                        </button>
                                    </p>
                                    <p class="control">
                                        <button class="button is-danger is-outlined" title="API-Key widerrufen" @click="removeApiKey(apiKey.id)">
                                            <span class="icon">
                                                <font-awesome-icon icon="trash-alt"/>
                                            </span>
                                            <span>Widerrufen</span>
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
  name: 'ApiKeyList',
  computed: {
    createdApiKey: function () {
      return this.$store.state['api-keys'].createdApiKey
    }
  },
  methods: {
    removeApiKey: function (id) {
      if (!id) {
        return
      }

      this.$store.dispatch('api-keys/remove', id)
    }
  }
}
</script>

<style scoped>

</style>
