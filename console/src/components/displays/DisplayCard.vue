<template>
  <div class="card mb-2">
    <div class="card-content">
      <article class="media">
        <div class="media-left">
          <DisplayIcon :display="display" size="2x"/>
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
              <router-link class="button is-outlined" title="Display bearbeiten" :to="{ name: 'display-form', params: { id: display.id } }">
                <span class="icon">
                  <font-awesome-icon icon="pencil-alt"/>
                </span>
                <span>Bearbeiten</span>
              </router-link>
            </p>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
import EditableText from '@/components/EditableText'
import DisplayIcon from '@/components/DisplayIcon'
export default {
  name: 'DisplayCard',
  components: {
    DisplayIcon,
    EditableText
  },
  computed: {
    displayIcon () {
      switch (this.display.type) {
        case 'tablet':
          return 'tablet-alt'
        default:
          return 'desktop'
      }
    }
  },
  props: {
    display: Object
  }
}
</script>

<style scoped>

</style>
