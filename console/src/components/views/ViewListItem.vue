<template>
    <div class="card">
        <div class="card-image">
            <figure class="image is-16by9">
                <div v-if="!view.active" class="fog">
                    Deaktiviert
                </div>
                <ViewPreview :view-data="view" class="has-ratio"/>
            </figure>
        </div>
        <footer class="card-footer">
            <div class="card-footer-item" v-if="view.active">
                <button class="button" @click="deactivateView">
                    <span class="icon">
                        <font-awesome-icon icon="pause"/>
                    </span>
                    <span>Deaktivieren</span>
                </button>
            </div>
            <div class="card-footer-item" v-if="!view.active">
                <button class="button" @click="activateView">
                    <span class="icon">
                        <font-awesome-icon icon="play"/>
                    </span>
                    <span>Aktivieren</span>
                </button>
            </div>
            <router-link :to="{ name: 'view-form', params: { display_id: view.displayId, view_id: view.id }}" class="card-footer-item">
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
    view: Object
  },
  methods: {
    activateView() {
      this.view.patch({ data: { active: true } });
    },
    deactivateView() {
      this.view.patch({ data: { active: false } });
    }
  }
}
</script>

<style scoped>
.fog {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    font-size: 2em;
}
</style>
