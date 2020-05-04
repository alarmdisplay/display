<template>
    <div class="setup-instructions">
        <h1>Willkommen</h1>
        <p>Dieses Display scheint noch nicht eingerichtet worden zu sein.</p>
        <p>Bitte stelle in der Console sicher, dass ein Display mit der folgenden Client-ID eingerichtet und aktiviert ist.</p>
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
.setup-instructions {
    font-size: 2em;
    padding: 1em 1em;
    text-align: center;
}

.display-identifier {
    font-size: 2.5em;
}
</style>
