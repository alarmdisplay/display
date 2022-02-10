<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Displays</h1>

      <div class="content">
        <p>
          Bevor ein Endgerät als Display verwendet werden kann, muss es hier freigeschaltet worden sein.
          Anfragen zur Freischaltung tauchen automatisch auf, sobald sich ein neues Display verbunden hat.
        </p>
      </div>

      <FeathersVuexFind v-slot="{ items: keyRequests }" service="key-requests" :query="{ $sort: { createdAt: 1 }, $limit: 50 }" qid="keyRequestList" watch="query">
        <div class="box has-background-grey-lighter" v-if="keyRequests.length">
          <h2 class="subtitle">
            Displays freischalten
          </h2>
          <div class="content">
            <p>
              Die 6-stellige ID wird auch auf dem Display selbst angezeigt.
              Sie dient als Kontrolle und zur Unterscheidung verschiedener Geräte, wenn du mehrere Displays aufsetzt.
            </p>
          </div>
          <div class="columns">
            <div class="column is-half" v-for="keyRequest in keyRequests" :key="keyRequest.id">
              <KeyRequestCard :key-request="keyRequest"/>
            </div>
          </div>
        </div>
      </FeathersVuexFind>

      <hr>
      <h2 class="subtitle">Konfigurierte Displays</h2>
      <FeathersVuexFind v-slot="{ items: displays }" service="displays" :query="{ $sort: { name: 1 }, $limit: 50 }" qid="displayList" watch="query">
        <div>
          <ul v-if="displays.length">
            <li v-for="display in displays" :key="display.id">
              <DisplayCard :display="display"/>
            </li>
          </ul>
          <p v-else>Es sind aktuell keine Displays konfiguriert. Folge der Dokumentation, um ein neues Display aufzusetzen.</p>
        </div>
      </FeathersVuexFind>
    </div>
  </section>
</template>

<script>
import DisplayCard from '@/components/displays/DisplayCard'
import KeyRequestCard from '@/views/displays/KeyRequestCard'

export default {
  name: 'DisplayList',
  components: { KeyRequestCard, DisplayCard }
}
</script>
