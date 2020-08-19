<template>
  <div class="view" :style="gridStyle">
    <GridViewComponent v-for="contentSlot in contentSlots" :content-slot="contentSlot" :key="contentSlot.id"/>
  </div>
</template>
<script>
    import GridViewComponent from "@/components/GridViewComponent";
    import {makeFindMixin} from "feathers-vuex";

    export default {
        name: "GridView",
        components: {
          GridViewComponent
        },
        computed: {
            contentSlotsParams() {
              return { query: { viewId: this.view.id } }
            },
            gridStyle: function () {
                if (!this.view.columns || !this.view.rows) {
                    return '';
                }

                return `grid-template-columns: repeat(${this.view.columns}, 1fr); grid-template-rows: repeat(${this.view.rows}, 1fr);`;
            }
        },
        mixins: [ makeFindMixin({
            service: 'content-slots',
            name: 'contentSlots',
            params: 'contentSlotsParams',
            local: true
        })],
        props: {
            view: Object
        }
    }
</script>

<style scoped>
    .view {
        display: grid;
        height: 100%;
        max-height: 100%;
        max-width: 100%;
    }
</style>
