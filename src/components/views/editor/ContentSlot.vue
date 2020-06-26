<template>
    <div class="content-slot" :style="gridItemStyle">
        <div class="icon drag-handle" draggable="true" @dragstart="startMove" @dragend="onDragEnd" title="Ziehen, um die Komponente zu verschieben">
            <font-awesome-icon icon="arrows-alt" />
        </div>
        <div class="content">
            <font-awesome-icon :icon="getIcon(contentSlot.componentType)" size="lg"/><br>
        </div>
        <div class="icon resize-handle" draggable="true" @dragstart="startResize" @dragend="onDragEnd" title="Ziehen, um die Größe der Komponente zu verändern">
            <font-awesome-icon icon="expand-alt" rotation="90" />
        </div>
        <button type="button" class="icon remove-icon" @click.stop.prevent="$emit('remove', contentSlot.id)" title="Komponente entfernen">
            <font-awesome-icon icon="trash-alt"/>
        </button>
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
    startMove: function () {
      this.$emit('action-started', 'move', this.contentSlot.id)
    },
    startResize: function () {
      this.$emit('action-started', 'resize', this.contentSlot.id)
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

.icon {
    visibility: hidden;
    position: absolute;
    height: 1.6em;
    width: 1.6em;
    background-color: rgba(0, 0, 0, 0.1);
    text-align: center;
    z-index: 2;
}

.content-slot:hover .icon {
    visibility: visible;
}

.icon:hover {
    background-color: rgba(0, 0, 0, 0.3);
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

.remove-icon {
    top: 7px;
    right: 7px;
    cursor: pointer;
    padding: 0;
    border: 0;
}
</style>
