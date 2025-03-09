<template>
    <section class="section">
        <div class="container">
            <h1 class="title">Kalender-Abonnements</h1>

            <div class="content">
                Lege hier Abonnements von Kalender-Feeds an, diese werden im Hintergrund regelmäßig abgerufen.
                Du kannst die abonnierten Kalender dann auf den Displays einbinden.
            </div>

            <div class="buttons">
                <router-link class="button" :to="{ name: 'calendar-feed-editor', params: { feedId: 'new' } }">
                    <span class="icon"><font-awesome-icon icon="plus"/></span>
                    <span>Kalender abonnieren</span>
                </router-link>
            </div>

            <FeathersVuexFind
                v-slot="{ items: feeds }"
                service="calendar-feeds"
                :query="{ $sort: { name: 1 }, $limit: 50 }"
                qid="calendarFeedsList"
                watch="query"
            >
                <table class="table is-fullwidth">
                    <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">URL</th>
                        <th scope="col">Aktionen</th>
                    </tr>
                    </thead>
                    <tbody>
                    <template v-for="feed in feeds">
                        <tr :key="feed.id">
                            <th scope="row">{{ feed.name }}</th>
                            <td>{{ feed.url }}</td>
                            <td class="is-narrow">
                                <div class="field is-grouped">
                                    <p class="control">
                                        <router-link class="button is-outlined" title="Abonnement bearbeiten" :to="{ name: 'calendar-feed-editor', params: { feedId: feed.id } }">
                                            <span class="icon">
                                                <font-awesome-icon icon="edit"/>
                                            </span>
                                            <span>Bearbeiten</span>
                                        </router-link>
                                    </p>
                                    <p class="control">
                                        <button class="button is-danger is-outlined" title="Abonnement beenden" @click="removeFeed(feed.id)">
                                            <span class="icon">
                                                <font-awesome-icon icon="trash-alt"/>
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
  name: 'CalendarsView',
  methods: {
    async removeFeed(feedId) {
      if (!feedId) {
        return
      }

      await this.$store.dispatch('calendar-feeds/remove', feedId)
    }
  },
}
</script>

<style scoped>

</style>
