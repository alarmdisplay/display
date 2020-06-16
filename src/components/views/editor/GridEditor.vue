<template>
    <div class="grid" :style="`grid-template-columns: repeat(${viewData.columns}, 1fr); grid-template-rows: repeat(${viewData.rows}, 1fr);`" @drop="onDrop($event)" @dragenter="onDragEnter($event)" @dragover="onDragOver($event)">
        <ContentSlot v-for="contentSlot in viewData.contentSlots" :key="contentSlot.id" :content-slot="contentSlot"/>
    </div>
</template>

<script>
import ContentSlot from '@/components/views/editor/ContentSlot'

export default {
  name: 'GridEditor',
  components: {
    ContentSlot
  },
  methods: {
    onDragEnter: function (event) {
      // Do not allow drop if it is not the grid background or there is no JSON in the dataTransfer
      if (!event.target.classList.contains('grid') || !event.dataTransfer.types.includes('application/json')) {
        return
      }

      event.effectAllowed = 'move'
      event.preventDefault()
    },
    onDragOver: function (event) {
      // Do not allow drop if it is not the grid background or there is no JSON in the dataTransfer
      if (!event.target.classList.contains('grid') || !event.dataTransfer.types.includes('application/json')) {
        return
      }

      event.effectAllowed = 'move'
      event.preventDefault()
    },
    onDrop: function (event) {
      console.log(event)
      const data = event.dataTransfer.getData('application/json')
      const contentSlot = JSON.parse(data)
      console.log(contentSlot)

      // Calculate the X and Y coordinates relative to the drop zone
      const clientRect = event.target.getBoundingClientRect()
      const x = event.clientX - clientRect.left
      const y = event.clientY - clientRect.top
      console.log('Content Slot', contentSlot.id, 'dropped at', x, y)

      // Calculate in which column and row the item has been dropped
      const columnWidth = clientRect.width / this.viewData.columns
      const rowHeight = clientRect.height / this.viewData.rows
      const column = Math.floor(x / columnWidth) + 1
      const row = Math.floor(y / rowHeight) + 1
      console.log(`Content Slot has been dropped in column ${column} and row ${row}`)
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
}
</style>
