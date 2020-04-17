<script>
    import AnnouncementList from "@/components/announcements/AnnouncementList";
    import Clock from "@/components/Clock";

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
            Clock
        },
        computed: {
            gridStyle: function () {
                if (!this.view.columns || !this.view.rows) {
                    return '';
                }

                /**
                 * Generate strings for the number of columns and rows, make all the entries the same percentage so they
                 * have the same height/width. Specifying all the entries as 'auto' should have the same effect, but
                 * causes rows/columns to shrink if they have no content.
                 */
                let columnsPercentage = 100 / this.view.columns;
                let columnsPercentageString = columnsPercentage.toFixed(1) + '%';
                let templateColumns = Array(this.view.columns).fill(columnsPercentageString).join(' ');

                let rowsPercentage = 100 / this.view.rows;
                let rowPercentageString = rowsPercentage.toFixed(1) + '%';
                let templateRows = Array(this.view.rows).fill(rowPercentageString).join(' ');

                return 'grid-template-columns: ' + templateColumns + '; grid-template-rows: ' + templateRows + ';';
            },
            getChildComponents: function () {
                let components = [];
                console.log('Component configs', this.view.components);
                for (let config of this.view.components) {
                    if (!config || !config.name || !config.instanceId) {
                        continue;
                    }

                    components.push({
                        instanceId: config.instanceId,
                        name: config.name,
                        options: config.options || {},
                        style: `grid-column-start: ${config.columnStart}; grid-row-start: ${config.rowStart}; grid-column-end: ${config.columnEnd}; grid-row-end: ${config.rowEnd}`
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
        height: 96%;
        margin: 2%;
        width: 96%;
    }
</style>
