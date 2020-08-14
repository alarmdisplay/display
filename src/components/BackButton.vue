<template>
    <button type="button" class="button" @click="$router.go(-1)">
            <span class="icon">
                <font-awesome-icon icon="chevron-left"/>
            </span>
        <span>Zurück</span>
    </button>
</template>
<script>
export default {
  name: 'BackButton'
}
</script>
