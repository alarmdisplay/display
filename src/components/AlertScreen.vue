<template>
    <DefaultAlertView :alert="mostRecentAlert"/>
</template>

<script>
    import DefaultAlertView from "@/components/DefaultAlertView";

    export default {
        name: "AlertScreen",
        components: {
            DefaultAlertView
        },
        computed: {
            mostRecentAlert: function () {
                let alerts = Array.from(this.alerts)
                alerts.sort((a, b) => b.time - a.time);
                return alerts[0];
            }
        },
        props: {
            alerts: Array
        }
    }
</script>

<style scoped>
</style>
