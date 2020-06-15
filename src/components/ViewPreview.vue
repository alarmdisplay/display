<template>
    <div class="preview" :style="gridStyle">
        <PreviewContentSlot v-for="contentSlot in this.viewData.contentSlots" :key="contentSlot.id" :content-slot="contentSlot"/>
    </div>
</template>

<script>
import PreviewContentSlot from '@/components/PreviewContentSlot'

export default {
  name: 'ViewPreview',
  components: {
    PreviewContentSlot
  },
  computed: {
    gridStyle: function () {
      if (!this.viewData.columns || !this.viewData.rows) {
        return ''
      }

      return `grid-template-columns: repeat(${this.viewData.columns}, 1fr); grid-template-rows: repeat(${this.viewData.rows}, 1fr);`
    }
  },
  props: {
    viewData: Object
  }
}
</script>

<style scoped>
.preview {
    display: grid;
    border: 1px solid #cccccc;
    box-shadow: 0 4px 10px 0 rgba(0,0,0,0.2);
    overflow: hidden;
    height: 100%;
    width: 100%;
}
</style>
