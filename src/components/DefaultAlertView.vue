<template>
    <div class="alert">
        <div class="info">
            <p class="title">{{ alert.title }}</p>
            <span class="subtitle">{{ alert.subtitle }}</span>
            <p class="address">{{ alert.location.raw || '' }}</p>
            <p class="description">{{ alert.description }}</p>
        </div>
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
        background-color: #eee;
        height: 100%;
        overflow: hidden;
        width: 100%;
        display: grid;
        place-content: space-evenly;
        grid-template-columns: 90%;
        grid-template-rows: 90%;
    }

    .info {
        padding: 0 2em;
    }

    .title {
        font-size: 4em;
    }

    .subtitle {
        background-color: orange;
        border-radius: 10px;
        font-size: 2.5em;
        padding: 0.3em;
    }

    .address {
        font-size: 3em;
    }

    .description {
        font-family: "Courier New", monospace;
        font-size: 2.5em;
        border: 1px solid black;
        background-color: aliceblue;
        padding: 0.4em;
    }
</style>
