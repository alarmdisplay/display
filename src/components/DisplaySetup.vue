<template>
    <div>
        <h1>Setup</h1>
        <p>Dieses Display scheint noch nicht eingerichtet worden zu sein</p>
        <p>Bitte stelle sicher, dass ein Display mit der folgenden ID in der Console eingerichtet und aktiviert ist.</p>
        <p class="display-identifier">{{ displayIdentifier }}</p>
    </div>
</template>

<script>
    export default {
        name: "DisplaySetup",
        props: {
            displayIdentifier: String
        }
    }
</script>

<style scoped>
.display-identifier {
    font-size: xx-large;
}
</style>
