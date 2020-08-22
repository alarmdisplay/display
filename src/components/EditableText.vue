<template>
    <span>
        <span class="clickable" title="Zum Bearbeiten klicken" v-show="!isEditing" @click.prevent="startEditing">{{ item[prop] || fallbackText || '' }}</span>
        <FeathersVuexInputWrapper :item="item" :prop="prop">
            <template #default="{ current, prop, createClone, handler }">
                <input
                        v-model="current[prop]"
                        type="text"
                        @focus="createClone"
                        @blur="e => handler(e, save)"
                        v-show="isEditing"
                        ref="input"
                        :class="['input', error ? 'is-danger' : '']"
                />
            </template>
        </FeathersVuexInputWrapper>
        <p class="help is-danger" v-if="error">{{ error.message || error.toString() }}</p>
    </span>
</template>

<script>
export default {
  name: 'EditableText',
  data: function () {
    return {
      error: null,
      isEditing: false
    }
  },
  props: {
    fallbackText: {
      type: String,
      required: false,
      default: ''
    },
    item: {
      type: Object,
      required: true
    },
    prop: {
      type: String,
      required: true
    }
  },
  methods: {
    startEditing () {
      this.isEditing = true
      this.$nextTick().then(() => this.focusInput())
    },
    focusInput () {
      this.$refs.input.focus()
    },
    async save ({ clone, data }) {
      this.error = null

      // Save changes to the store
      const updatedItem = clone.commit()

      // Patch only the data that has changed
      return updatedItem.patch({ data: data })
        .then(() => {
          this.isEditing = false
        })
        .catch(reason => {
          this.error = reason
        })
    }
  }
}
</script>

<style scoped>
.clickable {
    cursor: pointer;
}

.clickable:hover {
    background-color: rgba(0, 0, 0, 0.07);
}
</style>
