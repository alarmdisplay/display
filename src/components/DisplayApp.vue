<template>
    <IdleScreen v-bind:number-of-columns="screenConfigs.IdleScreen.columns" v-bind:number-of-rows="screenConfigs.IdleScreen.rows" v-bind:component-configs="screenConfigs.IdleScreen.components"/>
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
