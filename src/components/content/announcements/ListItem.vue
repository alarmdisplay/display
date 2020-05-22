<template>
    <li :class="getListItemClass()">
        <div class="w3-bar-item icon" style="vertical-align: center">
            <font-awesome-icon icon="bullhorn" size="2x"/>
        </div>
        <div class="w3-bar-item">
            <span class="title w3-large">{{ announcement.title || '(Kein Titel)' }}</span><br>
            <span>{{ getTextPreview() }}</span>
            <p v-if="announcement.validFrom || announcement.validTo">{{ getValidityInfo() }}</p>
        </div>
        <router-link :to="`/announcements/${announcement.id}`" tag="button" class="w3-bar-item w3-button w3-border w3-border-blue w3-hover-blue w3-round-medium w3-right">
            <font-awesome-icon icon="pencil-alt"/> Bearbeiten
        </router-link>
    </li>
</template>

<script>
export default {
  name: 'AnnouncementListItem',
  props: {
    announcement: Object
  },
  methods: {
    getListItemClass: function () {
      let classes = 'w3-bar'
      if (this.announcement.important) {
        classes += ' important'
      }
      return classes
    },
    getTextPreview: function () {
      const maxLength = 40
      const text = this.announcement.text || ''

      if (text.length <= maxLength) {
        return text
      }

      return text.substr(0, maxLength).concat(' ...')
    },
    getValidityInfo: function () {
      let string = 'Gültig'
      if (this.announcement.validFrom) {
        string += ' ab ' + this.$moment(this.announcement.validFrom * 1000).format('LLL') + ' Uhr'
      }
      if (this.announcement.validTo) {
        string += ' bis ' + this.$moment(this.announcement.validTo * 1000).format('LLL') + ' Uhr'
      }
      return string
    }
  }
}
</script>

<style scoped>
.important .title {
    font-weight: bold;
}
</style>
