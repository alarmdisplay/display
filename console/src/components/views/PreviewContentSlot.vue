<template>
    <div class="preview-content-slot" :style="gridItemStyle">
        <div class="content">
            <font-awesome-icon :icon="getComponentIcon(contentSlot.component)"/>
        </div>
    </div>
</template>

<script>
import { getComponentIcon } from '@/components'

export default {
  name: 'PreviewContentSlot',
  computed: {
    gridItemStyle: function () {
      return `grid-column-start: ${this.contentSlot.columnStart}; grid-row-start: ${this.contentSlot.rowStart}; grid-column-end: ${this.contentSlot.columnEnd}; grid-row-end: ${this.contentSlot.rowEnd}`
    }
  },
  methods: {
    getComponentIcon,
  },
  props: {
    contentSlot: Object
  }
}
</script>

<style scoped>
.preview-content-slot {
    height: 100%;
    overflow: hidden;
    padding: 7px;
}
.content {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.1);
    height: 100%;
    width: 100%;
}
</style>
