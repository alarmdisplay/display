<template>
  <form @submit.prevent="">
    <div class="field">
      <label class="label" for="input-url">
        URL
      </label>
      <div class="control">
        <input class="input" type="url" id="input-url" placeholder="https://example.org/image.jpg" v-model.trim="options.url">
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'RemoteImageOptions',
  props: {
    options: Object
  }
}
</script>

<style scoped>

</style>
