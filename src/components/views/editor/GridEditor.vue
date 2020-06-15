<template>
    <div class="grid" :style="`grid-template-columns: repeat(${viewData.columns}, 1fr); grid-template-rows: repeat(${viewData.rows}, 1fr);`" @drop="onDrop($event)" @dragenter.prevent @dragover.prevent>
        <ContentSlot v-for="contentSlot in viewData.contentSlots" :key="contentSlot.id" :content-slot="contentSlot"
                     draggable="true" @dragstart.native="startDrag($event, contentSlot)"/>
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
    startDrag: function (event, item) {
      console.log('Drag start with', item)
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('application/json', JSON.stringify(item))
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
