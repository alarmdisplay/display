<template>
    <div class="editor">
        <div ref="grid" class="grid" :style="`grid-template-columns: repeat(${columns}, 1fr); grid-template-rows: repeat(${rows}, 1fr);`">
            <ContentSlot v-for="contentSlot in contentSlots" :key="contentSlot.id" :content-slot="contentSlot" @action-started="onActionStarted" @drag-ended="onDragEnded" @remove="onRemoveContentSlot" @selected="onContentSlotSelected(contentSlot)"/>
            <div v-show="targetIndicator" ref="target-indicator" class="target-indicator" :style="targetIndicatorStyle"></div>
            <div v-show="action !== null" class="drop-zone" @drop="onDrop($event)" @dragenter="onDragEnter($event)" @dragover="onDragOver($event)" @dragleave="onDragLeave($event)"></div>
        </div>
        <div :class="['modal', (showOptionsModal ? 'is-active' : '')]">
          <div class="modal-background"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">Optionen</p>
              <button class="delete" aria-label="close" @click.prevent="closeOptionsModal"></button>
            </header>
            <section class="modal-card-body">
              <DWDWarningMapOptions v-if="selectedContentSlot && selectedContentSlot.component === 'DWDWarningMap'" :options="selectedContentSlot.options"/>
              <p v-else>
                Für diese Komponente gibt es keine Optionen
              </p>
            </section>
          </div>
        </div>
    </div>
</template>

<script>
import ContentSlot from '@/components/views/editor/ContentSlot'
import DWDWarningMapOptions from '@/components/views/editor/DWDWarningMapOptions'

const margin = 7

export default {
  name: 'GridEditor',
  components: {
    DWDWarningMapOptions,
    ContentSlot
  },
  computed: {
    columnWidth: function () {
      return this.$refs.grid.clientWidth / this.columns
    },
    rowHeight: function () {
      return this.$refs.grid.clientHeight / this.rows
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
      if (this.targetIndicator.columnStart + this.targetIndicator.columns > this.columns + 1 ||
        this.targetIndicator.rowStart + this.targetIndicator.rows > this.rows + 1) {
        style += '; border-color: red'
      }

      return style
    }
  },
  data: function () {
    return {
      action: null,
      selectedContentSlot: null,
      showOptionsModal: false,
      targetIndicator: null
    }
  },
  methods: {
    closeOptionsModal () {
      this.showOptionsModal = false
      this.selectedContentSlot = null
    },
    onContentSlotSelected (contentSlot) {
      this.selectedContentSlot = contentSlot
      this.showOptionsModal = true
    },
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
      let contentSlot = this.contentSlots.find(contentSlot => contentSlot.id === this.actionId)
      if (!contentSlot) {
        contentSlot = this.contentSlots.find(contentSlot => contentSlot.__id === this.actionId)
      }

      if (!contentSlot) {
        return
      }

      // Calculate the X and Y coordinates relative to the drop zone
      const clientRect = event.target.getBoundingClientRect()
      const x = event.clientX - clientRect.left
      const y = event.clientY - clientRect.top

      // Calculate in which column and row the item has been dropped
      const columnWidth = clientRect.width / this.columns
      const rowHeight = clientRect.height / this.rows
      const column = Math.floor(x / columnWidth) + 1
      const row = Math.floor(y / rowHeight) + 1

      // If the content slot would be partially outside the grid, do not accept the drop
      if (this.action === 'move' && (column + (contentSlot.columnEnd - contentSlot.columnStart) > this.columns + 1 ||
        row + (contentSlot.rowEnd - contentSlot.rowStart) > this.rows + 1)) {
        return
      }

      if (this.action === 'move' && (contentSlot.columnStart !== column || contentSlot.rowStart !== row)) {
        const columnDifference = column - contentSlot.columnStart
        const rowDifference = row - contentSlot.rowStart
        contentSlot.columnStart = column
        contentSlot.rowStart = row
        contentSlot.columnEnd += columnDifference
        contentSlot.rowEnd += rowDifference
      } else if (this.action === 'resize' && (contentSlot.columnEnd !== column + 1 || contentSlot.rowEnd !== row + 1)) {
        const newColumn = column + 1
        const newRow = row + 1

        // Only accept a resize, if the new values make sense (i.e. the end values are greater than the start values)
        if (newColumn >= contentSlot.columnStart + 1 && newRow >= contentSlot.rowStart + 1) {
          contentSlot.columnEnd = newColumn
          contentSlot.rowEnd = newRow
        }
      }
    },
    onActionStarted: function (action, contentSlotId) {
      let contentSlot = this.contentSlots.find(contentSlot => contentSlot.id === contentSlotId)
      if (!contentSlot) {
        contentSlot = this.contentSlots.find(contentSlot => contentSlot.__id === contentSlotId)
      }

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
    contentSlots: {
      type: Array,
      required: true
    },
    columns: {
      type: Number,
      required: true
    },
    rows: {
      type: Number,
      required: true
    }
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
