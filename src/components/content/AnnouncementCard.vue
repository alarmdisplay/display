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
          <button class="button is-small is-danger is-outlined" title="Ankündigung entfernen" @click="announcement.remove()">
            <span class="icon">
              <font-awesome-icon icon="trash-alt"/>
            </span>
          </button>
        </div>
      </article>
      <p class="has-text-right"><small>Stand: {{ announcement.updatedAt | moment('LL') }}</small></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnnouncementCard',
  props: {
    announcement: Object
  }
}
</script>

<style scoped>

</style>
