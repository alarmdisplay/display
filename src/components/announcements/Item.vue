<template>
    <li>Some announcement</li>
</template>

<script>
    export default {
        name: "Item",
        props: {
            announcement: Object
        }
    }
</script>

<style scoped>
    li {
        background-color: #ddd;
        border-bottom: 1px solid #999;
        list-style: none;
        padding: 1em;
    }
</style>
