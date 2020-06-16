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
      console.log(JSON.parse(data))
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
