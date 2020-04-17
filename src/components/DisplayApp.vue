<template>
    <IdleScreen v-bind:screen-config="idleScreenConfig"/>
</template>

<script>
    import IdleScreen from "@/components/IdleScreen";

    export default {
        name: "DisplayApp",
        components: {
            IdleScreen
        },
        computed: {
            idleScreenConfig: function () {
              let idleScreenConfigs = this.views.filter(view => view.screenType === 'IdleScreen')
              if (idleScreenConfigs.length === 0) {
                idleScreenConfigs = [{
                  columns: 3,
                  rows: 3,
                  components: [
                    {
                      name: 'Clock',
                      instanceId: -1,
                      columnStart: 2,
                      rowStart: 2,
                      columnEnd: 3,
                      rowEnd: 3
                    }
                  ]
                }]
              }

              // We return the first view config only, as multiple views per screen are not yet supported
              return idleScreenConfigs[0]
            }
        },
        props: {
            views: Array
        }
    }
</script>

<style scoped>

</style>
