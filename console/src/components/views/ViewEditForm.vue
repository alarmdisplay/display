<template>
  <div class="columns" v-if="item">
    <div class="column is-two-thirds">
      <div class="preview-container">
        <GridEditor :columns="item.columns" :rows="item.rows" :content-slots="item.contentSlots" @content-slot-removed="removeContentSlot"/>
      </div>
    </div>

    <div class="column is-one-third">
      <div class="panel">
        <div class="panel-heading">Raster</div>
        <div class="panel-block">
          <p>
            Die Komponenten können auf einem Raster angeordnet werden, wobei die Anzahl der Spalten und Zeilen die kleinstmögliche Größe einer Komponente bestimmen. Je mehr Spalten und Zeilen es gibt, desto feiner kann das Layout bestimmt werden. Komponenten können sich über mehrere Zeilen und/oder Spalten erstrecken.
          </p>
        </div>
        <div class="panel-block">
          <p class="control">
            <label class="label" for="input-columns">Spalten:</label>
            <input id="input-columns" type="number" min="1" class="input" v-model.number="item.columns">
          </p>
        </div>
        <div class="panel-block">
          <p class="control">
            <label class="label" for="input-rows">Zeilen:</label>
            <input id="input-rows" type="number" min="1" class="input" v-model.number="item.rows">
          </p>
        </div>
      </div>

      <div class="panel">
        <div class="panel-heading">Komponente hinzufügen</div>
        <div class="panel-block">
          <div class="control">
            <label class="label is-hidden" for="select-component-to-add">Verf&uuml;gbare Komponenten:</label>
            <div class="select">
              <select id="select-component-to-add">
                <option value="">Komponente wählen</option>
                <option v-for="componentType in availableComponentTypes" :key="`add-${componentType}`"
                        :value="componentType">{{ getComponentName(componentType) }}
                </option>
              </select>
            </div>
            <button type="button" @click="addContentSlot" class="button">Hinzuf&uuml;gen</button>
          </div>
        </div>
      </div>

      <button type="button" class="button is-success" @click="saveChanges">Speichern</button>
    </div>
  </div>
</template>

<script>
import GridEditor from '@/components/views/editor/GridEditor'

export default {
  name: 'ViewEditForm',
  data: function () {
    return {
      availableComponentTypes: ['AnnouncementList', 'DWDWarningMap', 'Clock']
    }
  },
  components: {
    GridEditor
  },
  methods: {
    addContentSlot: function () {
      const select = document.getElementById('select-component-to-add')
      if (!this.availableComponentTypes.includes(select.value)) {
        return
      }

      const { ContentSlot } = this.$FeathersVuex.api
      const contentSlot = new ContentSlot()
      contentSlot.component = select.value
      contentSlot.columnStart = 1
      contentSlot.rowStart = 1
      contentSlot.columnEnd = 2
      contentSlot.rowEnd = 2
      contentSlot.viewId = this.item.id

      this.item.contentSlots.push(contentSlot)
    },
    getComponentName: function (componentType) {
      switch (componentType) {
        case 'AnnouncementList':
          return 'Ankündigungen'
        case 'Clock':
          return 'Uhr'
        case 'DWDWarningMap':
          return 'DWD-Warnkarte'
        default:
          return componentType
      }
    },
    getIcon: function (componentType) {
      switch (componentType) {
        case 'AnnouncementList':
          return 'bullhorn'
        case 'Clock':
          return 'clock'
        case 'DWDWarningMap':
          return 'cloud-showers-heavy'
        default:
          return 'cube'
      }
    },
    isValid () {
      return this.item.rows > 1 && this.item.columns > 1
    },
    removeContentSlot: function (id) {
      this.item.contentSlots = this.item.contentSlots.filter(contentSlot => {
        return (contentSlot.id && contentSlot.id !== id) || (contentSlot.__isTemp && contentSlot.__id !== id)
      })
    }
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  setup (props, context) {
    function saveChanges () {
      if (this.isValid()) {
        context.emit('save')
      } else {
        // TODO show validation result
      }
    }
    return { saveChanges }
  }
}
</script>

<style scoped>
    .preview-container {
        box-shadow: 0 4px 10px 0 rgba(0,0,0,0.2);
    }
</style>
