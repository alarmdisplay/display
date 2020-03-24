import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'

// Import Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars, faDesktop, faHome, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Import components
import DisplayList from '@/components/DisplayList'
import Overview from '@/components/Overview'

// Configure Font Awesome
library.add(faBars, faDesktop, faHome, faTimes)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(VueRouter)

Vue.config.productionTip = false

const routes = [
  { path: '/', component: Overview },
  { path: '/displays', component: DisplayList }
]

const router = new VueRouter({
  routes: routes,
  linkActiveClass: 'w3-blue'
})

new Vue({
  render: h => h(App),
  router: router
}).$mount('#app')
