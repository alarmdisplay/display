<template>
    <div class="display-app">
        <AlertScreen v-if="activeAlerts.length > 0" :alerts="activeAlerts"/>
        <IdleScreen v-else v-bind:child-views="getViewsForScreenType('IdleScreen')"/>
    </div>
</template>

<script>
    import AlertScreen from "@/components/AlertScreen";
    import IdleScreen from "@/components/IdleScreen";

    export default {
        name: "DisplayApp",
        components: {
            AlertScreen,
            IdleScreen
        },
        computed: {
            activeAlerts: function () {
                return this.alerts.filter(alert => Math.floor(alert.expires.valueOf() / 1000) > this.$root.$data.seconds)
            }
        },
        methods: {
            getViewsForScreenType: function (screenType) {
                if (!screenType) {
                  return []
                }

                let views = this.views.filter(view => view.screenType === screenType)
                if (views.length === 0) {
                    // Return a fallback config that just shows the clock in the center
                    return [
                        {
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
                    ]
                }

                return views
            }
        },
        props: {
            alerts: Array,
            views: Array
        }
    }
</script>

<style scoped>
    .display-app {
        height: 100%;
        width: 100%;
    }
</style>
