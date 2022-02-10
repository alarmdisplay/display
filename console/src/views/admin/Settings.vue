<template>
    <section class="section">
        <div class="container">
            <h1 class="title">Einstellungen</h1>

            <table class="table is-fullwidth">
                <thead>
                <tr>
                    <th>Einstellung</th>
                    <th>Wert</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th>Anzeigedauer für Einsätze</th>
                    <td><IntegerValue settings-key="incident_display_minutes" unit="Minute(n)"/></td>
                </tr>
                <tr>
                    <th>Anzeigedauer für Probealarme</th>
                    <td><IntegerValue settings-key="incident_test_display_minutes" unit="Minute(n)"/></td>
                </tr>
                <tr>
                    <th>Anzeigefilter für Einsatzgrund</th>
                    <td><StringValue settings-key="reason_display_regex"/></td>
                </tr>
                <tr>
                    <th>Koordinaten des Standorts</th>
                    <td><CoordinateValue settings-key="station_coordinates"/></td>
                </tr>
                <tr>
                    <th>Text für Alarmbanner</th>
                    <td><StringValue settings-key="alert_banner_message"/></td>
                </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<script>
import CoordinateValue from '@/components/admin/settings/CoordinateValue'
import IntegerValue from '@/components/admin/settings/IntegerValue'
import StringValue from '@/components/admin/settings/StringValue'

export default {
  name: 'Settings',
  components: {
    CoordinateValue,
    IntegerValue,
    StringValue
  },
  created () {
    // Fetch all settings
    const { Setting } = this.$FeathersVuex.api
    Setting.find()
  }
}
</script>

<style scoped>

</style>
