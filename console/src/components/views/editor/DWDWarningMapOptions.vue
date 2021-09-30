<template>
  <form @submit.prevent="">
    <div class="field">
      <label class="label" for="select-options-maptype">
        Kartentyp
      </label>
      <div class="control">
        <div class="select">
          <select id="select-options-maptype" v-model="options.mapType">
            <option value="simple">Karte ohne Legende</option>
            <option value="area">Gebietszusammenfassung mit Legende</option>
          </select>
        </div>
      </div>
    </div>
    <div class="field">
      <label class="label" for="select-options-areacode">
        Bundesland / Region
      </label>
      <div class="control">
        <div class="select">
          <select id="select-options-areacode" v-model="options.areaCode">
            <option value="DE">Deutschland</option>
            <option value="DE-BW">Baden-Württemberg</option>
            <option value="DE-BY">Bayern</option>
            <option value="DE-BE">Berlin</option>
            <option value="Bodensee" :disabled="options.mapType !== 'area'">Bodensee</option>
            <option value="DE-BB">Brandenburg</option>
            <option value="DE-HB">Bremen</option>
            <option value="DE-HH">Hamburg</option>
            <option value="DE-HE">Hessen</option>
            <option value="DE-MV">Mecklenburg-Vorpommern</option>
            <option value="DE-NI">Niedersachsen</option>
            <option value="DE-NW">Nordrhein-Westfalen</option>
            <option value="DE-RP">Rheinland-Pfalz</option>
            <option value="DE-SL">Saarland</option>
            <option value="DE-SN">Sachsen</option>
            <option value="DE-ST">Sachsen-Anhalt</option>
            <option value="DE-SH">Schleswig-Holstein</option>
            <option value="DE-TH">Thüringen</option>
          </select>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'DWDWarningMapOptions',
  props: {
    options: Object
  }
}
</script>

<style scoped>

</style>
