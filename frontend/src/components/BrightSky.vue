<template>
  <div class="gridview-component centered">
    <span v-if="areCoordinatesValid === false">
      In den Einstellungen sind keine gültigen Koordinaten für den Standort hinterlegt.
    </span>
    <div v-else-if="weatherData" class="weather">
      <div class="temperature">
        <font-awesome-icon :icon="temperatureIcon" transform="shrink-2" />
        <span>
          {{ Number.isFinite(weatherData.weather.temperature) ? Math.round(weatherData.weather.temperature) : '--' }} &deg;C
        </span>
      </div>
      <div>
        <font-awesome-icon icon="fa-solid fa-arrow-up" class="top-icon" :transform="`rotate-${(weatherData.weather.wind_direction_10 || 0) + 180}`" /><br>
        <span class="value">
          {{ Math.round(weatherData.weather.wind_speed_10) || '--' }}&nbsp;km/h
        </span>
      </div>
      <div>
        <font-awesome-icon icon="fa-solid fa-angles-up" class="top-icon" :transform="`rotate-${ (weatherData.weather.wind_gust_direction_10 || 0) + 180 }`" /><br>
        <span class="value">
          {{ Math.round(weatherData.weather.wind_gust_speed_10) || '--' }}&nbsp;km/h
        </span>
      </div>
      <div>
        <font-awesome-icon :icon="icon" class="top-icon" /><br>
        <span class="value">
          {{ description }}
        </span>
      </div>
    </div>
    <div v-else-if="isLoading && !weatherData">
      <font-awesome-icon icon="fa-solid fa-spinner" spin-pulse />
      Lade Wetterdaten &hellip;
    </div>
    <div v-else>
      Keine Daten
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const weatherConditions = new Map([
  ['dry', 'Trocken'],
  ['fog', 'Nebel'],
  ['rain', 'Regen'],
  ['sleet', 'Schneeregen'],
  ['snow', 'Schnee'],
  ['hail', 'Hagel'],
  ['thunderstorm', 'Gewitter'],
]);
const weatherIcons = new Map([
    ['clear-day', 'sun'],
    ['clear-night', 'moon'],
    ['partly-cloudy-day', 'cloud-sun'],
    ['partly-cloudy-night', 'cloud-moon'],
    ['cloudy', 'cloud'],
    ['fog', 'cloud'],
    ['wind', 'wind'],
    ['rain', 'cloud-rain'],
    ['sleet', 'cloud-rain'],
    ['snow', 'snowflake'],
    ['hail', 'cloud-rain'],
    ['thunderstorm', 'cloud-bolt'],
]);


export default {
  name: "BrightSky",
  props: {
    instanceId: Number,
  },
  computed: {
    areCoordinatesValid () {
      if (!this.geoCoordinates || !this.geoCoordinates.latitude || !this.geoCoordinates.longitude) {
        return false;
      }

      return Number.isFinite(this.geoCoordinates.latitude) &&
          Number.isFinite(this.geoCoordinates.longitude) &&
          this.geoCoordinates.latitude >= -90 && this.geoCoordinates.latitude <= 90 &&
          this.geoCoordinates.longitude >= -180 && this.geoCoordinates.longitude <= 180;
    },
    description () {
      let condition = weatherConditions.get(this.weatherData.weather.condition);
      return condition ?? '--';
    },
    geoCoordinates () {
      return this.$store.getters['settings/getValue']('station_coordinates');
    },
    icon () {
      let icon = weatherIcons.get(this.weatherData.weather.icon);
      return icon ?? 'circle-question';
    },
    temperatureIcon () {
      if (this.previousTemperature === null) {
        return 'fa-solid fa-temperature-three-quarters';
      }

      if (this.weatherData.weather.temperature > this.previousTemperature) {
        return 'fa-solid fa-temperature-arrow-up';
      } else if (this.weatherData.weather.temperature < this.previousTemperature) {
        return 'fa-solid fa-temperature-arrow-down';
      }

      return 'fa-solid fa-temperature-three-quarters';
    }
  },
  data() {
    return {
      isLoading: false,
      previousTemperature: null,
      weatherData: null
    }
  },
  methods: {
    async getData() {
      this.isLoading = true;

      try {
        const response = await axios.get('https://api.brightsky.dev/current_weather', {
          headers: {
            'Content-Type': 'application/json'
          },
          params: {
            lat: this.geoCoordinates.latitude,
            lon: this.geoCoordinates.longitude,
          }
        });
        if (Number.isFinite(this.weatherData?.weather?.temperature)) {
          this.previousTemperature = this.weatherData.weather.temperature;
        }
        this.weatherData = response.data;
      } catch (error) {
        console.error(error);
        this.weatherData = null;
      } finally {
        this.isLoading = false;
      }
    }
  },
  mounted() {
    this.getData();
    setInterval(() => {
      this.getData();
    }, 600000);
  },
}
</script>

<style scoped>
.centered {
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.temperature {
  font-size: 2.5em;
}

.top-icon {
  font-size: 1.5em;
}

.weather {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.value {
  font-size: 1.2em;
}
</style>
