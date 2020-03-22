<template>
    <IdleScreen v-bind:screen-config="screenConfigs.IdleScreen"/>
</template>

<script>
    import IdleScreen from "@/components/IdleScreen";

    export default {
        name: "DisplayApp",
        components: {
            IdleScreen
        },
        props: {
            screenConfigs: Object
        }
    }
</script>

<style scoped>

</style>
