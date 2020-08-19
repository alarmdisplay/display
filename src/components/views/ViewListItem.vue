<template>
    <div class="card view">
        <div class="card-content preview-container">
            <ViewPreview :view-data="view"/>
        </div>
        <router-link :to="`/displays/${view.displayId}/views/${view.id}`" tag="button" class="button">
            <font-awesome-icon icon="pencil-alt"/> Bearbeiten
        </router-link>
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
    view: Object
  }
}
</script>

<style scoped>
.view {
    width: 25em;
    height: 20em;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    margin-right: 2em;
}

.preview-container {
    height: 66%;
}

.preview {
    border: 1px solid #9e9e9e;
}
</style>
