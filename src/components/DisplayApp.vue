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
            activeAlerts: function () {
                return this.alerts.filter(alert => Math.floor(alert.expires.valueOf() / 1000) > this.$root.$data.seconds)
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
            viewsParams() {
                return { query: { displayId: this.theDisplayId}}
            }
        },
        mixins: [ makeFindMixin({
            service: 'views',
            name: 'views',
            id: 'theDisplayId',
            params: 'viewsParams',
            local: true
        })],
        props: {
            theDisplayId: Number,
            alerts: Array
        }
    }
</script>

<style scoped>
    .display-app {
        height: 100%;
        width: 100%;
    }
</style>
