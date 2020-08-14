<template>
  <div class="card mb-2">
    <div class="card-content">
      <article class="media">
        <div class="media-left">
          <font-awesome-icon icon="desktop" size="2x"/>
        </div>
        <div class="media-content">
          <div class="content">
            <p class="has-text-weight-bold">
              <EditableText :item="display" prop="name"/>
            </p>
            <p :class="['description', display.description ? '' : 'has-text-grey-light']">
              <EditableText :item="display" prop="description" fallback-text="Keine Beschreibung"/>
            </p>
          </div>
        </div>
        <div class="media-right">
          <button class="button is-small is-danger is-outlined" title="Display entfernen" @click="display.remove()">
            <span class="icon">
              <font-awesome-icon icon="trash-alt"/>
            </span>
          </button>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
import EditableText from '@/components/EditableText'
export default {
  name: 'DisplayCard',
  components: {
    EditableText
  },
  props: {
    display: Object
  }
}
</script>

<style scoped>

</style>
