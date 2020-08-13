import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'

import router from './router'
import store from './store'
import moment from 'moment'
import VueMoment from 'vue-moment'

// Import Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowsAlt, faBars, faBullhorn, faClock, faCloudShowersHeavy, faColumns, faCube, faCubes, faDesktop, faExpandAlt, faHome, faPencilAlt, faPlusCircle, faSpinner, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Configure Font Awesome
library.add(faArrowsAlt, faBars, faBullhorn, faClock, faCloudShowersHeavy, faColumns, faCube, faCubes, faDesktop, faExpandAlt, faHome, faPencilAlt, faPlusCircle, faSpinner, faTimes, faTrashAlt)
Vue.component('font-awesome-icon', FontAwesomeIcon)

require('moment/locale/de')

Vue.use(Vuex)
Vue.use(VueMoment, { moment })

Vue.config.productionTip = false

// Set up the Vue root instance
new Vue({
  store,
  render: h => h(App),
  router: router
}).$mount('#app')
