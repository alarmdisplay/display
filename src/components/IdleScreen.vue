<script>
    import AnnouncementList from "@/components/announcements/AnnouncementList";
    import Clock from "@/components/Clock";

    export default {
        render: function (createElement) {

            let childComponents = [];
            for (let cc of this.getChildComponents) {
                childComponents.push(createElement(cc.name, {attrs: {style: cc.style}, props: {instanceId: cc.instanceId}}));
            }

            return createElement('div', {
                attrs: {
                    class: "idle-screen",
                    style: this.gridStyle
                }
            }, childComponents);
        },
        name: "IdleScreen",
        components: {
            AnnouncementList,
            Clock
        },
        computed: {
            gridStyle: function () {
                if (!this.screenConfig.columns || !this.screenConfig.rows) {
                    return '';
                }

                /**
                 * Generate strings for the number of columns and rows, make all the entries the same percentage so they
                 * have the same height/width. Specifying all the entries as 'auto' should have the same effect, but
                 * causes rows/columns to shrink if they have no content.
                 */
                let columnsPercentage = 100 / this.screenConfig.columns;
                let columnsPercentageString = columnsPercentage.toFixed(1) + '%';
                let templateColumns = Array(this.screenConfig.columns).fill(columnsPercentageString).join(' ');

                let rowsPercentage = 100 / this.screenConfig.rows;
                let rowPercentageString = rowsPercentage.toFixed(1) + '%';
                let templateRows = Array(this.screenConfig.rows).fill(rowPercentageString).join(' ');

                return 'grid-template-columns: ' + templateColumns + '; grid-template-rows: ' + templateRows + ';';
            },
            getChildComponents: function () {
                let components = [];
                console.log('Component configs', this.screenConfig.components);
                for (let config of this.screenConfig.components) {
                    if (!config || !config.name || !config.instanceId) {
                        continue;
                    }

                    components.push({
                        instanceId: config.instanceId,
                        name: config.name,
                        style: `grid-column-start: ${config.columnStart}; grid-row-start: ${config.rowStart}; grid-column-end: ${config.columnEnd}; grid-row-end: ${config.rowEnd}`
                    });
                }

                return components;
            }
        },
        props: {
            screenConfig: Object
        }
    }
</script>

<style scoped>
    .idle-screen {
        display: grid;
        height: 96%;
        width: 96%;
        margin: 2%;
    }
</style>
