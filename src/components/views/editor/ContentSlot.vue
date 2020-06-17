<template>
    <div class="content-slot" :style="gridItemStyle">
        <div class="handle drag-handle" draggable="true" @dragstart="startMove($event, contentSlot)" @dragend="onDragEnd">
            <font-awesome-icon icon="arrows-alt" />
        </div>
        <div class="content">
            <font-awesome-icon :icon="getIcon(contentSlot.componentType)"/>
        </div>
        <div class="handle resize-handle" draggable="true" @dragstart="startResize($event, contentSlot)" @dragend="onDragEnd">
            <font-awesome-icon icon="expand-alt" rotation="90" />
        </div>
    </div>
</template>

<script>
export default {
  name: 'ContentSlot',
  computed: {
    gridItemStyle: function () {
      return `grid-column-start: ${this.contentSlot.columnStart}; grid-row-start: ${this.contentSlot.rowStart}; grid-column-end: ${this.contentSlot.columnEnd}; grid-row-end: ${this.contentSlot.rowEnd}`
    }
  },
  methods: {
    getIcon: function (componentType) {
      switch (componentType) {
        case 'AnnouncementList':
          return 'bullhorn'
        case 'Clock':
          return 'clock'
        case 'DWDWarningMap':
          return 'cloud-showers-heavy'
        default:
          return 'cube'
      }
    },
    onDragEnd: function () {
      this.$emit('drag-ended')
    },
    startMove: function (event, item) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('application/json', JSON.stringify({ action: 'move', contentSlot: item }))
      this.$emit('move-started')
    },
    startResize: function (event, item) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('application/json', JSON.stringify({ action: 'resize', contentSlot: item }))
      this.$emit('resize-started')
    }
  },
  props: {
    contentSlot: Object
  }
}
</script>

<style scoped>
.content-slot {
    height: 100%;
    overflow: hidden;
    padding: 7px;
    position: relative;
}
.content {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.1);
    height: 100%;
    width: 100%;
}

.handle {
    position: absolute;
    height: 1.6em;
    width: 1.6em;
    background-color: rgba(0, 0, 0, 0.1);
    text-align: center;
}

.drag-handle {
    top: 7px;
    left: 7px;
    cursor: move;
}

.resize-handle {
    bottom: 7px;
    right: 7px;
    cursor: nwse-resize;
}
</style>
