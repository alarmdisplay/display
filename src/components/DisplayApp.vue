<template>
    <IdleScreen v-bind:number-of-columns="3" v-bind:number-of-rows="2"/>
</template>

<script>
    import IdleScreen from "@/components/IdleScreen";

    export default {
        name: "DisplayApp",
        components: {
            IdleScreen
        }
    }
</script>

<style scoped>

</style>
