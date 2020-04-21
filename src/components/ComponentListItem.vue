<template>
    <li class="w3-bar">
        <div class="w3-bar-item" style="vertical-align: center">
            <font-awesome-icon :icon="icon" size="2x"/>
        </div>
        <div class="w3-bar-item">
            <span class="w3-large">{{ componentObject.name || 'Kein Name' }}</span><br>
            <span>{{ componentName }}</span>
        </div>
    </li>
</template>

<script>
export default {
  name: 'ComponentListItem',
  computed: {
    componentName: function () {
      switch (this.componentObject.type) {
        case 'AnnouncementList':
          return 'Ankündigungen'
        case 'Clock':
          return 'Uhr'
        case 'DWDWarningsMap':
          return 'DWD-Warnkarte'
        default:
          return this.componentObject.type
      }
    },
    icon: function () {
      switch (this.componentObject.type) {
        case 'AnnouncementList':
          return 'bullhorn'
        case 'Clock':
          return 'clock'
        case 'DWDWarningsMap':
          return 'cloud-showers-heavy'
        default:
          return 'cube'
      }
    }
  },
  props: {
    componentObject: Object
  }
}
</script>

<style scoped>

</style>
