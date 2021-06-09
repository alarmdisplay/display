/* eslint-disable import/first */
import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
Vue.use(VueCompositionApi)

import App from './App.vue'
import router from './router'
import store from './store'

import moment from 'moment'
import VueMoment from 'vue-moment'
require('moment/locale/de')
Vue.use(VueMoment, { moment })

// Import Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowsAlt, faBars, faBullhorn, faChevronLeft, faChevronRight, faClock, faCloudShowersHeavy, faColumns, faCube, faCubes, faDesktop, faEdit, faEnvelope, faExpandAlt, faHome, faInfoCircle, faKey, faLock, faPencilAlt, faPlus, faQuestionCircle, faSignOutAlt, faSpinner, faStopwatch, faTimes, faTrashAlt, faUser, faUserEdit, faUserMinus, faUserPlus, faWrench } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Configure Font Awesome
library.add(faArrowsAlt, faBars, faBullhorn, faChevronLeft, faChevronRight, faClock, faCloudShowersHeavy, faColumns, faCube, faCubes, faDesktop, faEdit, faEnvelope, faExpandAlt, faHome, faInfoCircle, faKey, faLock, faPencilAlt, faPlus, faQuestionCircle, faSignOutAlt, faSpinner, faStopwatch, faTimes, faTrashAlt, faUser, faUserEdit, faUserMinus, faUserPlus, faWrench)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

Vue.filter('durationAsDigits', function (seconds) {
  function twoDigits (value) {
    let strValue = String(value)
    if (strValue.length === 1) {
      strValue = `0${value}`
    }
    return strValue
  }

  if (seconds < 3600) {
    return `${twoDigits(Math.trunc(seconds / 60))}:${twoDigits(seconds % 60)}`
  } else {
    const secondsOfHour = seconds % 3600
    return `${twoDigits(Math.trunc(seconds / 3600))}:${twoDigits(Math.trunc(secondsOfHour / 60))}:${twoDigits(secondsOfHour % 60)}`
  }
})

// Set up the Vue root instance
new Vue({
  store,
  render: h => h(App),
  data: {
    seconds: Math.floor(Date.now() / 1000)
  },
  mounted () {
    setInterval(this.updateSeconds, 1000)
  },
  methods: {
    updateSeconds () {
      this.seconds = Math.floor(Date.now() / 1000)
    }
  },
  router: router
}).$mount('#app')
