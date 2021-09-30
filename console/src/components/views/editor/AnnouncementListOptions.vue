<template>
  <form @submit.prevent="">
    <div class="field">
      <label class="label" for="input-title">
        Titel
      </label>
      <div class="control">
        <input class="input" type="text" id="input-title" placeholder="Bekanntmachungen" v-model.trim="options.title">
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'AnnouncementListOptions',
  props: {
    options: Object
  }
}
</script>

<style scoped>

</style>
