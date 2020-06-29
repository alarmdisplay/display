<template>
    <div class="editor">
        <div ref="grid" class="grid" :style="`grid-template-columns: repeat(${viewData.columns}, 1fr); grid-template-rows: repeat(${viewData.rows}, 1fr);`">
            <ContentSlot v-for="contentSlot in viewData.contentSlots" :key="contentSlot.id" :content-slot="contentSlot" @action-started="onActionStarted" @drag-ended="onDragEnded" @remove="onRemoveContentSlot"/>
            <div v-show="targetIndicator" ref="target-indicator" class="target-indicator" :style="targetIndicatorStyle"></div>
            <div v-show="action !== null" class="drop-zone" @drop="onDrop($event)" @dragenter="onDragEnter($event)" @dragover="onDragOver($event)" @dragleave="onDragLeave($event)"></div>
        </div>
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
      // Do not allow drop if it is not the drop zone
      if (event.target.classList.contains('drop-zone')) {
        event.dropEffect = 'move'
        event.preventDefault()
      }
    },
    onDragLeave: function (event) {
      // When the mouse leaves the grid, hide the target indicator, because dropping the content slot won't do anything
      if (event.target.classList.contains('drop-zone')) {
        this.targetIndicator = null
      }
    },
    onDragOver: function (event) {
      // Do not allow drop if it is not the drop zone
      if (event.target.classList.contains('drop-zone')) {
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
      // Get the content slot object by the ID we stored at the beginning of the action
      const contentSlot = this.viewData.contentSlots.find(contentSlot => contentSlot.id === this.actionId)
      if (!contentSlot) {
        return
      }

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
      if (this.action === 'move' && (column + (contentSlot.columnEnd - contentSlot.columnStart) > this.viewData.columns + 1 ||
        row + (contentSlot.rowEnd - contentSlot.rowStart) > this.viewData.rows + 1)) {
        return
      }

      if (this.action === 'move' && (contentSlot.columnStart !== column || contentSlot.rowStart !== row)) {
        this.$emit('content-slot-moved', { id: contentSlot.id, newColumn: column, newRow: row })
      } else if (this.action === 'resize' && (contentSlot.columnEnd !== column + 1 || contentSlot.rowEnd !== row + 1)) {
        this.$emit('content-slot-resized', { id: contentSlot.id, newColumn: column + 1, newRow: row + 1 })
      }
    },
    onActionStarted: function (action, contentSlotId) {
      const contentSlot = this.viewData.contentSlots.find(contentSlot => contentSlot.id === contentSlotId)
      if (!contentSlot) {
        return
      }

      this.action = action
      this.actionId = contentSlotId
      this.targetIndicator = {
        columnStart: contentSlot.columnStart,
        rowStart: contentSlot.rowStart,
        columns: contentSlot.columnEnd - contentSlot.columnStart,
        rows: contentSlot.rowEnd - contentSlot.rowStart
      }
    },
    onRemoveContentSlot: function (contentSlotId) {
      this.$emit('content-slot-removed', contentSlotId)
    }
  },
  props: {
    viewData: Object
  }
}
</script>

<style scoped>
.editor {
    position: relative;
    width: 100%;
    padding-top: 56.25%; /* simulate 16:9 aspect ratio */
}

.grid {
    display: grid;
    border: 1px solid gray;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
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
    z-index: 1;
}
</style>
