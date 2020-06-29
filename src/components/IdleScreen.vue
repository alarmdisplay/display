<template>
    <div class="idle-screen">
        <GridView v-for="(view, index) in sortedChildViews" v-show="activeViewIndex === index" :key="view.id" :view="view"/>
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
        data : function () {
            return {
                activeViewIndex: 0
            }
        },
        mounted: function () {
            // If there are multiple views, show each one for 60 seconds
            setInterval(() => {
                this.activeViewIndex = (this.activeViewIndex + 1) % this.childViews.length
            }, 60000);
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
        font-size: 3vh;
    }
</style>
