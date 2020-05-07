<template>
    <div class="alert">
        <p>{{ alert.title }}</p>
        <p>{{ alert.time }}</p>
    </div>
</template>

<script>
    export default {
        name: "DefaultAlertView",
        props: {
            alert: Object
        }
    }
</script>

<style scoped>
    .alert {
        height: 100%;
        width: 100%;
    }
</style>
