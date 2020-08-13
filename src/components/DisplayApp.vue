<template>
    <div class="display-app">
        <AlertScreen v-if="activeAlerts.length > 0" :alerts="activeAlerts"/>
        <IdleScreen v-else v-bind:child-views="idleViews"/>
    </div>
</template>

<script>
    import { makeFindMixin } from 'feathers-vuex';
    import AlertScreen from "@/components/AlertScreen";
    import IdleScreen from "@/components/IdleScreen";

    /**
     * Incidents older that this amount of milliseconds are not loaded from the server
     *
     * @type {number}
     */
    const MAX_AGE_INCIDENTS_MS = 60 * 60 * 1000

    /**
     * Incidents marked as Test, will only be show for this long
     *
     * @type {number}
     */
    const TEST_DURATION_MS = 60 * 1000

    const fallbackView = {
      columns: 3,
      rows: 3,
      contentSlots: [
        {
          componentType: 'Clock',
          id: -1,
          columnStart: 2,
          rowStart: 2,
          columnEnd: 3,
          rowEnd: 3
        }
      ]
    }

    export default {
        name: "DisplayApp",
        components: {
            AlertScreen,
            IdleScreen
        },
        computed: {
            activeAlerts() {
                return this.incidents.filter(incident => {
                  const timeVisible = incident.status === 'Test' ? TEST_DURATION_MS : MAX_AGE_INCIDENTS_MS
                  return (Math.floor(incident.time.valueOf() + timeVisible) / 1000) > this.$root.$data.seconds;
                })
            },
            idleViews() {
              if (!this.views) {
                return [fallbackView]
              }

              const idleViews = this.views.filter(view => view.type === 'idle')
              if (idleViews.length === 0) {
                return [fallbackView]
              }

              return idleViews
            },
            incidentsParams() {
              // Only load the most recent incidents from the server
              return { query: {
                time: {
                  $gt: new Date().getTime() - MAX_AGE_INCIDENTS_MS
                }
              }}
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
</style>
