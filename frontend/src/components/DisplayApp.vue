<template>
    <div class="display-app">
        <AlertScreen v-if="activeAlerts.length > 0" :alerts="activeAlerts"/>
        <IdleScreen v-else-if="idleViews.length" v-bind:child-views="idleViews"/>
        <div v-else class="fallback-idle-screen">
          <Clock/>
        </div>
    </div>
</template>

<script>
import {makeFindMixin} from 'feathers-vuex';
import AlertScreen from "@/components/AlertScreen";
import IdleScreen from "@/components/IdleScreen";
import Clock from "@/components/Clock";

    export default {
        name: "DisplayApp",
        components: {
          Clock,
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
            incidentsParams() {
              // Only load the most recent incidents from the server
              return { query: {
                time: {
                  $gt: new Date().getTime() - this.incidentDisplayDuration
                }
              }}
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
            params: 'incidentsParams'
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
    .display-app {
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
</style>
