<template>
    <div class="w3-main" style="margin-left:300px;margin-top:43px;">
        <header class="w3-container" style="padding-top:22px">
            <h2><b><font-awesome-icon icon="desktop" /> Displays</b></h2>
        </header>

        <div class="w3-row-padding w3-margin-bottom w3-margin-top">
            <template v-for="display in this.$root.$data.displays">
                <div class="w3-quarter" v-bind:key="display.id">
                    <DisplayCard v-bind:display="display" />
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import DisplayCard from '@/components/DisplayCard'

export default {
  name: 'DisplayList',
  components: {
    DisplayCard
  }
}
</script>

<style scoped>

</style>
