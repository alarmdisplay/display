<template>
    <div class="display-app">
        <AlertScreen v-if="alerts.length > 0" :alerts="alerts"/>
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
                            components: [
                                {
                                    name: 'Clock',
                                    instanceId: -1,
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
