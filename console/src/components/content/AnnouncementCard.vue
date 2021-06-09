<template>
  <div class="card mb-2">
    <div class="card-content">
      <article class="media">
        <div class="media-left">
          <font-awesome-icon icon="bullhorn" size="2x"/>
        </div>
        <div class="media-content">
          <div class="content">
            <p class="has-text-weight-bold">
              {{ announcement.title }}
            </p>
            <p>
              {{ announcement.body }}
            </p>
          </div>
        </div>
        <div class="media-right">
          <div class="field is-grouped">
            <p class="control">
              <button class="button is-outlined" title="Ankündigung bearbeiten" @click="$router.push({ name: 'announcement-form', params: { id: `${announcement.id}` } })">
                  <span class="icon">
                      <font-awesome-icon icon="edit"/>
                  </span>
                <span>Bearbeiten</span>
              </button>
            </p>
            <p class="control">
              <button class="button is-danger is-outlined" title="Ankündigung entfernen" @click="announcement.remove()">
                <span class="icon">
                  <font-awesome-icon icon="trash-alt"/>
                </span>
              </button>
            </p>
          </div>
        </div>
      </article>
      <div class="level">
        <div class="level-left">
            <small v-if="announcement.validFrom || announcement.validTo" class="level-item">{{ getValidityInfo() }}</small>
        </div>
        <div class="level-right">
          <small>Stand: {{ announcement.updatedAt | moment('LL') }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnnouncementCard',
  props: {
    announcement: Object
  },
  methods: {
    getValidityInfo: function () {
      let string = 'Gültig'
      if (this.announcement.validFrom) {
        string += ' ab ' + this.$moment(this.announcement.validFrom).format('LLL') + ' Uhr'
      }
      if (this.announcement.validTo) {
        string += ' bis ' + this.$moment(this.announcement.validTo).format('LLL') + ' Uhr'
      }
      return string
    }
  }
}
</script>

<style scoped>

</style>
