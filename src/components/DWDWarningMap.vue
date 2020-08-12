<template>
    <div class="gridview-component">
        <img :src="imgurl" alt="">
    </div>
</template>

<script>
    import {makeFindMixin} from "feathers-vuex";

    /**
     * Possible options:
     * - areaCode: An ISO 3166-2 code for one of the 16 german states, 'DE' for entire Germany, or (only with
     *   mapType = area) 'Bodensee' for the Bodensee region
     * - mapType: Can be 'simple' for a map of a single state or entire Germany, or 'area' for a map of one or
     *   more states including more detail about the warnings
     */

    export default {
        name: "DWDWarningMap",
        computed: {
            areaCode: function () {
                return this.options.find(option => option.key === 'areaCode').value || 'DE';
            },
            baseUrl: function () {
                switch (this.mapType) {
                    case 'simple':
                        return `https://www.dwd.de/DWD/warnungen/warnapp_gemeinden/json/warnungen_gemeinde_map_${this.stateCode}.png`;
                    case 'area':
                        return `https://www.dwd.de/DWD/warnungen/warnstatus/Schilder${this.schilderCode}.jpg`;
                    default:
                        return 'https://www.dwd.de/DWD/warnungen/warnapp_gemeinden/json/warnungen_gemeinde_map_de.png';
                }
            },
            imgurl: function () {
                return `${this.baseUrl}?${this.cacheBustingQuery}`;
            },
            mapType: function () {
                return this.options.find(option => option.key === 'mapType').value || 'area';
            },
            optionsParams() {
              return { query: { contentSlotId: this.instanceId } }
            },
            schilderCode: function () {

                switch (this.areaCode) {
                    case 'DE':
                        return 'D';
                    case 'DE-BW':
                        return 'SU';
                    case 'DE-BY':
                        return 'MS';
                    case 'DE-BE':
                    case 'DE-BB':
                    case 'DE-MV':
                        return 'PD';
                    case 'DE-HB':
                    case 'DE-HH':
                    case 'DE-NI':
                    case 'DE-SH':
                        return 'HA';
                    case 'DE-HE':
                    case 'DE-RP':
                    case 'DE-SL':
                        return 'OF';
                    case 'DE-NW':
                        return 'EM';
                    case 'DE-SN':
                    case 'DE-ST':
                    case 'DE-TH':
                        return 'LZ';
                    case 'Bodensee':
                        return 'Bodensee';
                    default:
                        return 'D';
                }
            },
            stateCode: function () {
                switch (this.areaCode) {
                    case 'DE-BW':
                    case 'Bodensee':
                        return 'baw';
                    case 'DE-BY':
                        return 'bay';
                    case 'DE-BE':
                    case 'DE-BB':
                        return 'bbb';
                    case 'DE-HB':
                    case 'DE-NI':
                        return 'nib';
                    case 'DE-HH':
                    case 'DE-SH':
                        return 'shh';
                    case 'DE-HE':
                        return 'hes';
                    case 'DE-MV':
                        return 'mvp';
                    case 'DE-NW':
                        return 'nrw';
                    case 'DE-RP':
                    case 'DE-SL':
                        return 'rps';
                    case 'DE-SN':
                        return 'sac';
                    case 'DE-ST':
                        return 'saa';
                    case 'DE-TH':
                        return 'thu';
                    default:
                        return 'de';
                }
            }
        },
        data: function () {
            return {
                cacheBustingQuery: Date.now()
            }
        },
        mixins: [
          makeFindMixin({
            service: 'content-slot-options',
            name: 'options',
            params: 'optionsParams',
            local: true,
            qid: 'dwdOptions'
          })
        ],
        mounted: function() {
            // update the query part of the URL every 10 minutes, so it gets reloaded
            setInterval(() => {
                this.cacheBustingQuery = Date.now();
            }, 600000);
        },
        props: {
            instanceId: Number
        }
    }
</script>

<style scoped>
    img {
        background-color: #ccc;
        box-shadow: 0 4px 10px 0 rgba(0,0,0,0.2),0 4px 20px 0 rgba(0,0,0,0.19);
        max-height: 100%;
        max-width: 100%;
        object-fit: scale-down;
    }
</style>
