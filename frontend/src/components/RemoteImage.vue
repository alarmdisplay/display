<template>
    <div class="gridview-component">
        <div class="image" :style="divStyle">&nbsp;</div>
    </div>
</template>

<script>
export default {
  name: 'RemoteImage',
  props: {
    instanceId: Number,
    options: {
      type: Object,
      default: () => {},
    }
  },
  computed: {
    divStyle() {
      return `background-image: url('${this.srcUrl}')`;
    },
    srcUrl() {
      return this.options.url || '';
    }
  },
}
</script>

<style scoped>
.image {
    box-shadow: 0 4px 10px 0 rgba(0,0,0,0.2),0 4px 20px 0 rgba(0,0,0,0.19);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    height: 100%;
    overflow: hidden;
}
</style>
