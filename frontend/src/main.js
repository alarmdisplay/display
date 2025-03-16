import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
Vue.use(VueCompositionApi)

import App from './App.vue'
import store from './store'

import moment from 'moment'
import VueMoment from 'vue-moment';

// Load Font Awesome
import FontAwesomeIcon from './font-awesome'
Vue.component('font-awesome-icon', FontAwesomeIcon)

require('moment/locale/de');
Vue.use(VueMoment, { moment });

import 'leaflet/dist/leaflet.css';

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  store,
  data: {
    minutes: Math.floor(Date.now() / 60000),
    seconds: Math.floor(Date.now() / 1000)
  },
  created: function () {
    this.$moment.locale('de');
  },
  mounted: function () {
    setTimeout(this.hideSplashScreen, 3000);
    setInterval(this.updateSeconds, 1000);
  },
  methods: {
    updateSeconds: function () {
      this.seconds = Math.floor(Date.now() / 1000)
    },
    hideSplashScreen: function () {
      this.$store.commit('setShowSplashScreen', false)
    }
  },
  watch: {
    seconds(newValue) {
      this.minutes = Math.floor(newValue / 60);
    }
  }
}).$mount('#app');

