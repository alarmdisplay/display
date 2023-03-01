<template>
    <div class="display-app" :class="{ 'with-alert-banner': allAlertsAreEmpty }">
      <AlertBanner class="alert-banner" v-if="allAlertsAreEmpty" :test-alert="allAlertsAreTests"/>
      <div class="main-area">
        <AlertScreen v-if="activeAlerts.length > 0 && !allAlertsAreEmpty" :alerts="activeAlerts"/>
        <IdleScreen v-else-if="idleViews.length" v-bind:child-views="idleViews"/>
        <div v-else class="fallback-idle-screen">
          <Clock/>
        </div>
      </div>
    </div>
</template>

<script>
import {makeFindMixin} from 'feathers-vuex';
import AlertBanner from '@/components/AlertBanner'
import AlertScreen from "@/components/AlertScreen";
import IdleScreen from "@/components/IdleScreen";
import Clock from "@/components/Clock";

    export default {
        name: "DisplayApp",
        components: {
          Clock,
          AlertBanner,
            AlertScreen,
            IdleScreen
        },
        computed: {
            activeAlerts() {
                return this.incidents.filter(incident => {
                  const timeVisible = incident.status === 'Test' ? this.testIncidentDisplayDuration : this.incidentDisplayDuration
                  return (Math.floor(incident.time.valueOf() + timeVisible) / 1000) > this.$root.$data.seconds;
                })
            },
            allAlertsAreEmpty () {
              return this.activeAlerts.length > 0 && this.activeAlerts.every((alert) => { return !alert.reason && !alert.keyword && !alert.description })
            },
          allAlertsAreTests () {
            return this.activeAlerts.length > 0 && this.activeAlerts.every((alert) => { return alert.status === 'Test' })
          },
            incidentDisplayDuration() {
              let minutes = this.$store.getters['settings/getIntegerValue']('incident_display_minutes') || 60
              return minutes * 60 * 1000
            },
            idleViews() {
              if (!this.views) {
                return []
              }

              return this.views.filter(view => view.type === 'idle')
            },
            testIncidentDisplayDuration() {
              let minutes = this.$store.getters['settings/getIntegerValue']('incident_test_display_minutes') || 1
              return minutes * 60 * 1000
            },
            viewsParams() {
                return { query: { displayId: this.theDisplayId}}
            }
        },
        mixins: [ makeFindMixin({
            service: 'incidents',
            name: 'incidents',
            params() {
              // Only load the most recent incidents from the server
              return { query: {
                  time: {
                    $gt: new Date().getTime() - this.incidentDisplayDuration
                  }
                }}
            },
            watch: true
        }), makeFindMixin({
            service: 'views',
            name: 'views',
            params: 'viewsParams',
            local: true
        })],
        props: {
            theDisplayId: Number
        }
    }
</script>

<style scoped>
    .alert-banner {
      min-height: 10%;
      max-height: 10%;
      font-size: 7vh;
    }

    .display-app {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
    }

    .fallback-idle-screen {
      height: 100%;
      width: 100%;
      font-size: 3vh;
      display: flex;
      justify-content: center;
    }

    .main-area {
      height: 100%;
    }

    .display-app.with-alert-banner .main-area {
      height: 90%;
    }
</style>
