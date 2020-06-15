<template>
    <div class="w3-card view">
        <div class="w3-container preview-container">
            <ViewPreview :view-data="view"/>
        </div>
        <router-link :to="`/displays/${view.displayId}/views/${view.id}`" tag="button" class="w3-button w3-block">
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
}

.preview-container {
    height: 66%;
}

.preview {
    border: 1px solid #9e9e9e;
}
</style>
