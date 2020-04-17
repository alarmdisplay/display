<template>
    <div class="idle-screen">
        <GridView v-for="view of sortedChildViews" v-bind:key="view.id" v-bind:id="`view-${view.id}`" :view="view"/>
    </div>
</template>

<script>
    import GridView from "@/components/GridView";

    export default {
        name: "IdleScreen",
        components: {
            GridView
        },
        computed: {
            sortedChildViews: function () {
                let views = Array.from(this.childViews)
                // Make sure the views are in the desired order
                views.sort(((a, b) => {
                    return a.order - b.order;
                }));
                return views;
            }
        },
        props: {
            childViews: Array
        }
    }
</script>

<style scoped>
    .idle-screen {
        height: 100%;
        width: 100%;
    }
</style>
