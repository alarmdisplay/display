<script>
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
            Clock
        },
        computed: {
            gridStyle: function () {
                if (!this.numberOfColumns || !this.numberOfRows) {
                    return '';
                }

                /**
                 * Generate strings for the number of columns and rows, make all the entries the same percentage so they
                 * have the same height/width. Specifying all the entries as 'auto' should have the same effect, but
                 * causes rows/columns to shrink if they have no content.
                 */
                let columnsPercentage = 100 / this.numberOfColumns;
                let columnsPercentageString = columnsPercentage.toFixed(1) + '%';
                let templateColumns = Array(this.numberOfColumns).fill(columnsPercentageString).join(' ');

                let rowsPercentage = 100 / this.numberOfRows;
                let rowPercentageString = rowsPercentage.toFixed(1) + '%';
                let templateRows = Array(this.numberOfRows).fill(rowPercentageString).join(' ');

                return 'grid-template-columns: ' + templateColumns + '; grid-template-rows: ' + templateRows + ';';
            },
            getChildComponents: function () {
                return [
                    {name: 'Clock', style: 'grid-column-start: 1; grid-column-end: 2; grid-row-start: 1; grid-row-end: 2; background-color: yellow'},
                    {name: 'Clock', style: 'grid-column-start: 2; grid-column-end: 3; grid-row-start: 2; grid-row-end: 3; background-color: yellow'}
                ];
            }
        },
        props: {
            numberOfColumns: Number,
            numberOfRows: Number
        }
    }
</script>

<style scoped>
    .idle-screen {
        display: grid;
        background-color: green;
        height: 100%;
    }
</style>
