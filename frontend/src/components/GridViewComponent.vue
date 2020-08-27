<script>
import AnnouncementList from "@/components/announcements/AnnouncementList";
import Clock from "@/components/Clock";
import DWDWarningMap from "@/components/DWDWarningMap";
import {makeFindMixin} from "feathers-vuex";

export default {
  name: "GridViewComponent",
  render (createElement) {
    const style = `grid-column-start: ${this.contentSlot.columnStart}; grid-row-start: ${this.contentSlot.rowStart}; grid-column-end: ${this.contentSlot.columnEnd}; grid-row-end: ${this.contentSlot.rowEnd}`
    return createElement(this.contentSlot.component, { attrs: { style: style }, props: { instanceId: this.contentSlot.id, options: this.options } })
  },
  components: {
    AnnouncementList,
    Clock,
    DWDWarningMap
  },
  computed: {
    optionsParams () {
      return { query: { contentSlotId: this.contentSlot.id } }
    },
  },
  mixins: [ makeFindMixin({
    service: 'content-slot-options',
    name: 'options',
    params: 'optionsParams',
    local: true
  })],
  props: {
    contentSlot: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
