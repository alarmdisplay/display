<template>
    <div ref="grid" class="grid" :style="`grid-template-columns: repeat(${viewData.columns}, 1fr); grid-template-rows: repeat(${viewData.rows}, 1fr);`">
        <ContentSlot v-for="contentSlot in viewData.contentSlots" :key="contentSlot.id" :content-slot="contentSlot" @move-started="onMoveStarted" @resize-started="onResizeStarted" @drag-ended="onDragEnded"/>
        <div v-show="targetIndicator" ref="target-indicator" class="target-indicator" :style="targetIndicatorStyle"></div>
        <div v-show="action" class="drop-zone" @drop="onDrop($event)" @dragenter="onDragEnter($event)" @dragover="onDragOver($event)" @dragleave="onDragLeave($event)"></div>
    </div>
</template>

<script>
import ContentSlot from '@/components/views/editor/ContentSlot'

const margin = 7

export default {
  name: 'GridEditor',
  components: {
    ContentSlot
  },
  computed: {
    columnWidth: function () {
      return this.$refs.grid.clientWidth / this.viewData.columns
    },
    rowHeight: function () {
      return this.$refs.grid.clientHeight / this.viewData.rows
    },
    targetIndicatorStyle: function () {
      if (!this.targetIndicator) {
        return ''
      }

      const left = (this.targetIndicator.columnStart - 1) * this.columnWidth + margin
      const top = (this.targetIndicator.rowStart - 1) * this.rowHeight + margin
      const width = this.targetIndicator.columns * this.columnWidth - 2 * margin
      const height = this.targetIndicator.rows * this.rowHeight - 2 * margin
      let style = `left: ${left}px; top: ${top}px; width: ${width}px; height: ${height}px`

      // If the content slot was dropped at the current position, it would be partially outside the grid
      if (this.targetIndicator.columnStart + this.targetIndicator.columns > this.viewData.columns + 1 ||
        this.targetIndicator.rowStart + this.targetIndicator.rows > this.viewData.rows + 1) {
        style += '; border-color: red'
      }

      return style
    }
  },
  data: function () {
    return {
      action: null,
      targetIndicator: null
    }
  },
  methods: {
    onDragEnded: function () {
      this.action = null
      this.targetIndicator = null
    },
    onDragEnter: function (event) {
      // Do not allow drop if it is not the drop zone or there is no JSON in the dataTransfer
      if (event.target.classList.contains('drop-zone') && event.dataTransfer.types.includes('application/json')) {
        event.dropEffect = 'move'
        event.preventDefault()
      }

      const data = event.dataTransfer.getData('application/json')
      const json = JSON.parse(data)
      const contentSlot = json.contentSlot
      this.targetIndicator = {
        columnStart: contentSlot.columnStart,
        rowStart: contentSlot.rowStart,
        columns: contentSlot.columnEnd - contentSlot.columnStart,
        rows: contentSlot.rowEnd - contentSlot.rowStart
      }
    },
    onDragLeave: function (event) {
      // When the mouse leaves the grid, hide the target indicator, because dropping the content slot won't do anything
      if (event.target.classList.contains('drop-zone')) {
        this.targetIndicator = null
      }
    },
    onDragOver: function (event) {
      // Do not allow drop if it is not the drop zone or there is no JSON in the dataTransfer
      if (event.target.classList.contains('drop-zone') && event.dataTransfer.types.includes('application/json')) {
        event.dropEffect = 'move'
        event.preventDefault()
      }

      if (this.targetIndicator) {
        // Calculate the X and Y coordinates relative to the drop zone
        const clientRect = event.target.getBoundingClientRect()
        const x = event.clientX - clientRect.left
        const y = event.clientY - clientRect.top
        const column = Math.floor(x / this.columnWidth) + 1
        const row = Math.floor(y / this.rowHeight) + 1
        if (this.action === 'move') {
          this.targetIndicator.columnStart = column
          this.targetIndicator.rowStart = row
        } else if (this.action === 'resize') {
          this.targetIndicator.columns = column + 1 - this.targetIndicator.columnStart
          this.targetIndicator.rows = row + 1 - this.targetIndicator.rowStart
        }
      }
    },
    onDrop: function (event) {
      const data = event.dataTransfer.getData('application/json')
      const json = JSON.parse(data)
      const contentSlot = json.contentSlot

      // Calculate the X and Y coordinates relative to the drop zone
      const clientRect = event.target.getBoundingClientRect()
      const x = event.clientX - clientRect.left
      const y = event.clientY - clientRect.top

      // Calculate in which column and row the item has been dropped
      const columnWidth = clientRect.width / this.viewData.columns
      const rowHeight = clientRect.height / this.viewData.rows
      const column = Math.floor(x / columnWidth) + 1
      const row = Math.floor(y / rowHeight) + 1

      // If the content slot would be partially outside the grid, do not accept the drop
      if (json.action === 'move' && (column + (contentSlot.columnEnd - contentSlot.columnStart) > this.viewData.columns + 1 ||
        row + (contentSlot.rowEnd - contentSlot.rowStart) > this.viewData.rows + 1)) {
        return
      }

      if (json.action === 'move' && (contentSlot.columnStart !== column || contentSlot.rowStart !== row)) {
        this.$emit('content-slot-moved', { id: contentSlot.id, newColumn: column, newRow: row })
      } else if (json.action === 'resize' && (contentSlot.columnEnd !== column + 1 || contentSlot.rowEnd !== row + 1)) {
        this.$emit('content-slot-resized', { id: contentSlot.id, newColumn: column + 1, newRow: row + 1 })
      }
    },
    onMoveStarted: function () {
      this.action = 'move'
    },
    onResizeStarted: function () {
      this.action = 'resize'
    }
  },
  props: {
    viewData: Object
  }
}
</script>

<style scoped>
.grid {
    display: grid;
    border: 1px solid gray;
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;
}

.target-indicator {
    border: 2px dashed gray;
    z-index: -2;
    position: absolute;
}

.drop-zone {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 3;
}
</style>
