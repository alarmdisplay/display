<template>
    <div :class="alertClass">
        <div class="clock-container">
            <Clock :instance-id="0" :show-date="false"/>
        </div>
        <div class="info">
            <p class="title">{{ alert.reason || 'Einsatz' }}</p>
            <span class="badge badge-test">TEST</span>
            <span v-if="alert.keyword" class="badge badge-category">{{ alert.keyword }}</span>
            <span class="badge badge-elapsed-time"><font-awesome-icon icon="stopwatch"/> {{ elapsedTime }}</span>
            <p class="address">{{ locationText || 'Keine Ortsangabe' }}</p>
            <p class="description">{{ alert.description || 'Keine Bemerkung' }}</p>
        </div>
    </div>
</template>

<script>
    import Clock from "@/components/Clock";
    import {makeFindMixin} from "feathers-vuex";

    export default {
        name: "DefaultAlertView",
        components: {
            Clock
        },
        computed: {
            alertClass: function () {
                let classes = ['alert']
                classes.push(`category-${this.alert.category}`)
                if (this.alert.status === 'Test') {
                    classes.push('test')
                }
                return classes.join(' ')
            },
            elapsedTime: function () {
                let elapsedSeconds = this.$root.$data.seconds - Math.floor(this.alert.time.valueOf() / 1000);
                return textForSeconds(elapsedSeconds);
            },
            locationsParams() {
                return {
                  query: {
                    incidentId: this.alert.id,
                    $sort: {
                      createdAt: -1
                    },
                    $limit: 1
                  }
                }
            },
            locationText() {
              if (this.locations.length) {
                return this.locations[0].rawText
              }

              return ''
            }
        },
      mixins: [
        makeFindMixin({
          service: 'locations',
          name: 'locations',
          params: 'locationsParams'
        })
      ],
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
        padding: 0 2em;
    }

    .title {
        font-size: 4em;
        padding-right: 4.5em;
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
    }

    .description {
        font-family: "Courier New", monospace;
        font-size: 2.5em;
        border: 1px solid black;
        background-color: aliceblue;
        padding: 0.4em;
    }
</style>
