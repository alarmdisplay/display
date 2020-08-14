<template>
    <section class="section">
        <div class="container">
            <h1 class="title">Displays</h1>

            <div class="content">
                Bevor ein Endgerät als Anzeige verwendet werden kann, muss es hier angelegt werden.
            </div>

            <div class="buttons">
                <router-link tag="button" type="button" class="button" to="new" append>
                    <span class="icon"><font-awesome-icon icon="plus"/></span>
                    <span>Display anlegen</span>
                </router-link>
            </div>

            <FeathersVuexFind service="displays" :query="{ $sort: { name: 1 }, $limit: 50 }" qid="displayList" watch="query">
                <ul slot-scope="{ items: displays }">
                    <li v-for="display in displays" :key="display.id">
                        <DisplayCard :display="display"/>
                    </li>
                </ul>
            </FeathersVuexFind>
        </div>
    </section>
</template>

<script>
import DisplayCard from '@/components/displays/DisplayCard'
export default {
  name: 'WatchedFolderList',
  components: { DisplayCard }
}
</script>

<style scoped>

</style>
