<script>
    import AnnouncementList from "@/components/announcements/AnnouncementList";
    import Clock from "@/components/Clock";
    import DWDWarningMap from "@/components/DWDWarningMap";

    export default {
        name: "GridView",
        render: function (createElement) {

            let childComponents = [];
            for (let cc of this.getChildComponents) {
                childComponents.push(createElement(cc.name, {attrs: {style: cc.style}, props: {instanceId: cc.instanceId, options: cc.options}}));
            }

            return createElement('div', {
                attrs: {
                    class: "view",
                    style: this.gridStyle
                }
            }, childComponents);
        },
        components: {
            AnnouncementList,
            Clock,
            DWDWarningMap
        },
        computed: {
            gridStyle: function () {
                if (!this.view.columns || !this.view.rows) {
                    return '';
                }

                return `grid-template-columns: repeat(${this.view.columns}, 1fr); grid-template-rows: repeat(${this.view.rows}, 1fr);`;
            },
            getChildComponents: function () {
                let components = [];
                console.log('Component configs', this.view.contentSlots);
                for (let contentSlot of this.view.contentSlots) {
                    if (!contentSlot || !contentSlot.component || !contentSlot.id) {
                        continue;
                    }

                    components.push({
                        instanceId: contentSlot.id,
                        name: contentSlot.component,
                        options: contentSlot.options || {},
                        style: `grid-column-start: ${contentSlot.columnStart}; grid-row-start: ${contentSlot.rowStart}; grid-column-end: ${contentSlot.columnEnd}; grid-row-end: ${contentSlot.rowEnd}`
                    });
                }

                return components;
            }
        },
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
