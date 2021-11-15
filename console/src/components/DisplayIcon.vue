<template>
    <font-awesome-icon :icon="getIcon(display)" :size="size"/>
</template>

<script>
const icons = {
  monitor: 'desktop',
  tablet: 'tablet-alt'
}

export default {
  name: 'DisplayIcon',
  methods: {
    getIcon: function (display) {
      if (!display || !display.type || !Object.keys(icons).includes(display.type.toLowerCase())) {
        return icons.monitor
      }

      return icons[display.type.toLowerCase()]
    }
  },
  props: {
    display: {
      type: Object,
      required: true
    },
    size: {
      type: String,
      required: false
    }
  }
}
</script>

<style scoped>

</style>
