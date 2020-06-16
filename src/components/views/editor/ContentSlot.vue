<template>
    <div class="content-slot" :style="gridItemStyle">
        <div class="drag-handle" draggable="true" @dragstart="startDrag($event, contentSlot)">
            <font-awesome-icon icon="arrows-alt" />
        </div>
        <div class="content">
            <font-awesome-icon :icon="getIcon(contentSlot.componentType)"/>
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
    startDrag: function (event, item) {
      console.log('Drag start with', item)
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('application/json', JSON.stringify(item))
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
.drag-handle {
    position: absolute;
    top: 7px;
    left: 7px;
    height: 1.6em;
    width: 1.6em;
    background-color: rgba(0, 0, 0, 0.1);
    text-align: center;
    cursor: move;
}
</style>
