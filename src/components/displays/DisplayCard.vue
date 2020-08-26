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
          <div class="field is-grouped">
            <p class="control">
              <button class="button is-outlined" title="Ansichten bearbeiten" @click="$router.push({ name: 'view-list', params: { display_id: `${display.id}` } })">
                <span class="icon">
                    <font-awesome-icon icon="columns"/>
                </span>
                <span>Ansichten</span>
              </button>
            </p>
            <p class="control">
              <button class="button is-danger is-outlined" title="Display entfernen" @click="display.remove()">
            <span class="icon">
              <font-awesome-icon icon="trash-alt"/>
            </span>
              </button>
            </p>
          </div>
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
