<script>
    import AnnouncementList from "@/components/announcements/AnnouncementList";
    import Clock from "@/components/Clock";

    export default {
        render: function (createElement) {

            let childComponents = [];
            for (let cc of this.getChildComponents) {
                childComponents.push(createElement(cc.name, {attrs: {style: cc.style}}));
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
                if (!this.screenConfig.layout.columns || !this.screenConfig.layout.rows) {
                    return '';
                }

                /**
                 * Generate strings for the number of columns and rows, make all the entries the same percentage so they
                 * have the same height/width. Specifying all the entries as 'auto' should have the same effect, but
                 * causes rows/columns to shrink if they have no content.
                 */
                let columnsPercentage = 100 / this.screenConfig.layout.columns;
                let columnsPercentageString = columnsPercentage.toFixed(1) + '%';
                let templateColumns = Array(this.screenConfig.layout.columns).fill(columnsPercentageString).join(' ');

                let rowsPercentage = 100 / this.screenConfig.layout.rows;
                let rowPercentageString = rowsPercentage.toFixed(1) + '%';
                let templateRows = Array(this.screenConfig.layout.rows).fill(rowPercentageString).join(' ');

                return 'grid-template-columns: ' + templateColumns + '; grid-template-rows: ' + templateRows + ';';
            },
            getChildComponents: function () {
                let components = [];
                console.log('Component configs', this.screenConfig.layout.components);
                for (let config of this.screenConfig.layout.components) {
                    if (!config.name || !config.bounds) {
                        continue;
                    }

                    components.push({
                        name: config.name,
                        style: `grid-column-start: ${config.bounds.columnStart}; grid-row-start: ${config.bounds.rowStart}; grid-column-end: ${config.bounds.columnEnd}; grid-row-end: ${config.bounds.rowEnd}`
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
