<template>
    <div class="content-slot" :style="gridItemStyle">
        <div class="slot-icon drag-handle" draggable="true" @dragstart="startMove" @dragend="onDragEnd" title="Ziehen, um die Komponente zu verschieben">
            <font-awesome-icon icon="arrows-alt" />
        </div>
        <div class="content">
          <div class="has-text-centered">
            <span class="icon">
              <font-awesome-icon :icon="getIcon(contentSlot.component)" size="lg"/>
            </span>
            <p v-if="componentTypesWithOptions.includes(contentSlot.component)">
              <a href="#" @click.prevent="$emit('selected', contentSlot)">
                {{ getComponentName(contentSlot.component) }}
              </a>
            </p>
            <p class="" v-else>
              {{ getComponentName(contentSlot.component) }}
            </p>
          </div>
        </div>
        <div class="slot-icon resize-handle" draggable="true" @dragstart="startResize" @dragend="onDragEnd" title="Ziehen, um die Größe der Komponente zu verändern">
            <font-awesome-icon icon="expand-alt" rotation="90" />
        </div>
        <div class="slot-icon remove-icon" @click.stop.prevent="$emit('remove', contentSlot.id || contentSlot.__id)" title="Komponente entfernen">
            <font-awesome-icon icon="trash-alt"/>
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
  data () {
    return {
      componentTypesWithOptions: ['DWDWarningMap', 'AnnouncementList']
    }
  },
  methods: {
    getComponentName: function (componentType) {
      switch (componentType) {
        case 'AnnouncementList':
          return 'Ankündigungen'
        case 'Clock':
          return 'Uhr'
        case 'DWDWarningMap':
          return 'DWD-Warnkarte'
        default:
          return componentType
      }
    },
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
      this.$emit('action-started', 'move', this.contentSlot.id || this.contentSlot.__id)
    },
    startResize: function () {
      this.$emit('action-started', 'resize', this.contentSlot.id || this.contentSlot.__id)
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

.slot-icon {
    visibility: hidden;
    position: absolute;
    height: 1.6em;
    width: 1.6em;
    background-color: rgba(0, 0, 0, 0.1);
    text-align: center;
    z-index: 2;
}

.content-slot:hover .slot-icon {
    visibility: visible;
}

.slot-icon:hover {
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

.selected-content-slot .content {
  background-color: #00bcd4;
}
</style>
