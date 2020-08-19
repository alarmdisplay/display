<template>
    <section class="section">
        <div class="container">
            <h1 class="title">Ank&uuml;ndigungen</h1>

            <div class="content">
                Ankündigungen können auf den Displays im Ruhemodus angezeigt werden, um aktuelle Informationen zu verbreiten.
                Ein optionaler Gültigkeitszeitraum erlaubt ein zeitgesteuertes Ein- und Ausblenden von einzelnen Einträgen.
            </div>

            <div class="buttons">
                <router-link tag="button" type="button" class="button" to="new" append>
                    <span class="icon"><font-awesome-icon icon="plus"/></span>
                    <span>Ankündigung anlegen</span>
                </router-link>
            </div>

            <FeathersVuexFind service="announcements" :query="{ $sort: { updatedAt: -1 }, $limit: 50 }" qid="announcementList" watch="query">
                <ul slot-scope="{ items: announcements }">
                    <li v-for="announcement in announcements" :key="announcement.id">
                        <AnnouncementCard :announcement="announcement"/>
                    </li>
                </ul>
            </FeathersVuexFind>
        </div>
    </section>
</template>

<script>
import AnnouncementCard from '@/components/content/AnnouncementCard'
export default {
  name: 'AnnouncementList',
  components: { AnnouncementCard }
}
</script>

<style scoped>

</style>
