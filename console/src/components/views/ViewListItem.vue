<template>
    <div class="card">
        <div class="card-image">
          <figure class="image is-16by9">
            <ViewPreview :view-data="view" class="has-ratio"/>
          </figure>
        </div>
        <footer class="card-footer">
          <a class="card-footer-item has-text-danger is-disabled" v-if="removable" href="#" @click.prevent="view.remove()">
            <span class="icon">
              <font-awesome-icon icon="trash-alt"/>
            </span>
            <span>Löschen</span>
          </a>
          <router-link :to="`/displays/${view.displayId}/views/${view.id}`" class="card-footer-item">
            <span class="icon">
              <font-awesome-icon icon="pencil-alt"/>
            </span>
            <span>Bearbeiten</span>
          </router-link>
        </footer>
    </div>
</template>

<script>
import ViewPreview from '@/components/views/ViewPreview'
export default {
  name: 'ViewListItem',
  components: {
    ViewPreview
  },
  props: {
    view: Object,
    removable: Boolean
  }
}
</script>

<style scoped>
</style>
