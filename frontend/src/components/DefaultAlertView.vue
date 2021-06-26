<template>
    <div :class="['alert', { test: alert.status === 'Test' }]">
        <div class="clock-container">
            <Clock :instance-id="0" :show-date="false"/>
        </div>
        <div class="info">
            <p class="title">{{ titleText }}</p>
            <div class="badges">
                <span class="badge badge-test">TEST</span>
                <span v-if="alert.keyword" class="badge badge-category">{{ alert.keyword }}</span>
                <span class="badge badge-elapsed-time"><font-awesome-icon icon="stopwatch"/> {{ elapsedTime }}</span>
            </div>
            <div class="details">
                <div class="address-and-description" :style="{ width: (showMap ? '50%' : '100%') }">
                    <p class="address">{{ locationText || 'Keine Ortsangabe' }}</p>
                    <p v-if="alert.description" class="description">{{ alert.description }}</p>
                </div>
                <div v-if="showMap" class="map-holder">
                    <LMap class="map" :bounds="mapBounds" :options="{ zoomSnap: 0.1 }">
                        <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap-Mitwirkende"></LTileLayer>
                        <LMarker v-if="originCoordinates" :lat-lng="originCoordinates"></LMarker>
                        <LCircleMarker :lat-lng="[alert.location.latitude, alert.location.longitude]" color="red"/>
                    </LMap>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Clock from "@/components/Clock";
    import { LCircleMarker, LMap, LMarker, LTileLayer } from 'vue2-leaflet';
    import { Icon, LatLngBounds } from 'leaflet';

    // Fix missing icons due to Webpack
    delete Icon.Default.prototype._getIconUrl;
    Icon.Default.mergeOptions({
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });

    export default {
        name: "DefaultAlertView",
        components: {
            Clock,
            LCircleMarker,
            LMap,
            LMarker,
            LTileLayer
        },
        computed: {
            elapsedTime: function () {
                let elapsedSeconds = this.$root.$data.seconds - Math.floor(this.alert.time.valueOf() / 1000);
                return textForSeconds(elapsedSeconds);
            },
            originCoordinates () {
              return this.$store.getters['settings/getLeafletCoords']('station_coordinates');
            },
            locationText() {
              if (this.alert.location) {
                let location = this.alert.location
                let line1 = `${location.street} ${location.number}`.trim()
                if (line1 !== '' && location.detail) {
                  line1 += ` (${location.detail})`
                }
                let string = `${line1}\n${location.locality}`.trim()
                return /^[\s\n]*$/.test(string) ? location.rawText : string
              }

              return ''
            },
            mapBounds () {
              if (!this.showMap) {
                return ''
              }

              let latLngBounds = new LatLngBounds([this.originCoordinates, [this.alert.location.latitude, this.alert.location.longitude]])

              return latLngBounds.pad(0.2)
            },
            showMap () {
              return this.alert.location && this.alert.location.latitude && this.alert.location.longitude
            },
            titleText () {
                let reason = this.alert.reason || 'Einsatzgrund unbekannt'
                return (this.alert.status === 'Exercise' ? `Übung: ${reason}` : reason)
          }
        },
        props: {
            alert: Object
        }
    }

    function textForSeconds(seconds) {
        function twoDigits(value) {
            let strValue = String(value);
            if (strValue.length === 1) {
                strValue = `0${value}`
            }
            return strValue
        }

        if (seconds < 3600) {
            return `${twoDigits(Math.trunc(seconds / 60))}:${twoDigits(seconds % 60)}`
        } else {
            let secondsOfHour = seconds % 3600;
            return `${twoDigits(Math.trunc(seconds / 3600))}:${twoDigits(Math.trunc(secondsOfHour / 60))}:${twoDigits(secondsOfHour % 60)}`
        }
    }
</script>

<style scoped>
    .alert {
        background-color: #eee;
        color: #2c3e50;
        height: 100%;
        overflow: hidden;
        width: 100%;
        display: grid;
        place-content: space-evenly;
        grid-template-columns: 90%;
        grid-template-rows: 90%;
        font-size: 2vh;
    }

    .clock-container {
        position: absolute;
        right: 3vw;
        top: 2vh;
    }

    .clock-container .clock {
        color: unset;
    }

    .info {
        padding: 0;
    }

    .title {
        font-size: 4em;
        padding-right: 4em;
        margin-top: 2vh;
    }

    .badges {
        margin-bottom: 3em;
    }

    .badge {
        border-radius: 10px;
        font-size: 2.5em;
        padding: 0.3em 0.5em;
        font-weight: bold;
        margin-right: 0.6em;
    }

    .badge-category {
      background-color: red;
      color: white;
    }

    .badge-test {
        display: none;
        background-color: red;
        color: white;
    }

    .badge-elapsed-time {
        background-color: #2c3e50;
        color: white;
    }

    .alert.test .badge-test {
        display: unset;
        animation: blinking 2s cubic-bezier(.68,-0.55,.27,1.55) infinite
    }

    @keyframes blinking {
        50% {
            opacity: 0;
        }
    }

    .address {
        font-size: 3em;
        white-space: pre;
        margin-top: 0;
        margin-bottom: 0.5em;
    }

    .description {
        font-family: "Courier New", monospace;
        font-size: 2.3em;
        border: 1px solid black;
        background-color: aliceblue;
        padding: 0.4em;
        white-space: pre-line;
        margin: 0;
        overflow: hidden;
    }

    .details {
        display: flex;
        justify-content: space-between;
        height: 56vh;
    }

    .address-and-description {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .map-holder {
        width: 50%;
        padding-left: 1em;
    }

    .map {
        width: 100%;
        height: 100%;
        border: 1px solid gray;
    }
</style>
