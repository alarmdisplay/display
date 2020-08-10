import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
Vue.use(VueCompositionApi)

import App from './App.vue'
import store from './store'

import moment from 'moment'
import VueMoment from 'vue-moment';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/index.css';

// Import Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBullhorn, faClock, faStopwatch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Configure Font Awesome
library.add(faBullhorn, faClock, faStopwatch)
Vue.component('font-awesome-icon', FontAwesomeIcon)

require('moment/locale/de');

Vue.use(VueMoment, { moment });
Vue.use(VueToast);

Vue.config.productionTip = false;

new Vue({
  render: function(h) {
    return h(App, {
      props: {
        alerts: this.alerts,
        showSplashScreen: this.showSplashScreen,
        views: this.views
      }
    });
  },
  store,
  data: {
    alerts: [],
    content: {},
    seconds: Math.floor(Date.now() / 1000),
    showSplashScreen: true,
    views: []
  },
  created: function () {
    this.$moment.locale('de');
    this.resetData();
  },
  mounted: function () {
    setTimeout(this.hideSplashScreen, 3000);
    setInterval(this.updateSeconds, 1000);
  },
  methods: {
    resetData: function () {
      this.alerts = [];
      this.content = {};
      this.views = [];
    },
    updateSeconds: function () {
      this.seconds = Math.floor(Date.now() / 1000)
    },
    setAlerts: function (alerts) {
      this.alerts = alerts
    },
    setViews: function (views) {
      if (!Array.isArray(views)) {
        return
      }

      const validViews = views.filter(view => {
        try {
          validateView(view);
        } catch (e) {
          Vue.$toast.error(`View config rejected: ${e.message}`);
          return false;
        }

        return true;
      });

      // Ensure each Component has its entry in the content, so the Components can watch their content entry
      validViews.forEach(view => {
        view.contentSlots.forEach(contentSlot => {
          if (!this.content[contentSlot.id]) {
            this.$set(this.content, contentSlot.id, undefined)
          }
        })
      })

      // Update the views
      this.views = validViews
      console.log('views is now', this.views)
    },
    hideSplashScreen: function () {
      this.showSplashScreen = false;
    }
  }
}).$mount('#app');

/**
 * Validates a particular view configuration for structural errors.
 *
 * @param view
 * @throws {Error}
 */
function validateView(view) {
  console.log('Validating view', view);

  if (!view) {
    throw new Error('Configuration is empty');
  }

  const validScreenTypes = ['idle']
  if (!Object.prototype.hasOwnProperty.call(view, 'screenType') || !validScreenTypes.includes(view.screenType)) {
    throw new Error('Screen type is not valid');
  }

  if (!Object.prototype.hasOwnProperty.call(view, 'columns') || view.columns < 1) {
    throw new Error('Number of columns is not valid');
  }

  if (!Object.prototype.hasOwnProperty.call(view, 'rows') || view.rows < 1) {
    throw new Error('Number of rows is not valid');
  }

  if (!Object.prototype.hasOwnProperty.call(view, 'contentSlots') || !Array.isArray(view.contentSlots) || view.contentSlots.length === 0) {
    throw new Error('No contentSlots specified');
  }

  const validComponents = ['AnnouncementList', 'Clock', 'DWDWarningMap'];
  for (let contentSlot of view.contentSlots) {
    if (!contentSlot.componentType || !validComponents.includes(contentSlot.componentType)) {
      throw new Error('No valid component type specified');
    }

    if (!contentSlot.columnStart || !contentSlot.rowStart || !contentSlot.columnEnd || !contentSlot.rowEnd) {
      throw new Error('Not all bounds specified');
    }

    if (contentSlot.columnStart < 1 || contentSlot.rowStart < 1 || contentSlot.columnEnd > (view.columns + 1) || contentSlot.rowEnd > (view.rows + 1)) {
      throw new Error('Bounds exceed column/row count');
    }

    if (contentSlot.columnEnd <= contentSlot.columnStart || contentSlot.rowEnd <= contentSlot.rowStart) {
      throw new Error('Column/row end value must be greater that respective start value');
    }
  }
}
