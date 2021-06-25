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
                </tbody>
            </table>
        </div>
    </section>
</template>

<script>
import IntegerValue from '@/components/admin/settings/IntegerValue'

export default {
  name: 'Settings',
  components: {
    IntegerValue
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
