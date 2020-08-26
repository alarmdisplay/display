<template>
  <form @submit.prevent="">
    <div class="field">
      <label class="label" for="input-title">
        Titel
      </label>
      <div class="control">
        <input class="input" type="text" id="input-title" placeholder="Ankündigungen" v-model.trim="title.value">
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'AnnouncementListOptions',
  data () {
    return {
      title: { value: '' }
    }
  },
  methods: {
    setOption (key, defaultValue) {
      const option = this.options.find(option => option.key === key)
      if (!option) {
        const { ContentSlotOption } = this.$FeathersVuex.api
        const newOption = new ContentSlotOption()
        newOption.key = key
        newOption.value = defaultValue
        this[key] = newOption
        this.options.push(newOption)
        return
      }

      this[key] = option
    }
  },
  created () {
    this.setOption('title', '')
  },
  props: {
    options: Array
  }
}
</script>

<style scoped>

</style>
