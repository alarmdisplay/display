import Vue from 'vue'
import App from './App.vue'
import moment from 'moment'
import io from 'socket.io-client'
import VueMoment from 'vue-moment';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/index.css';

require('moment/locale/de');

Vue.use(VueMoment, { moment });
Vue.use(VueToast);

Vue.config.productionTip = false;

let socket;

let vm = new Vue({
  render: function(h) {
    return h(App, {
      props: {
        authenticated: this.authenticated,
        displayId: this.displayId,
        showSplashScreen: this.showSplashScreen,
        views: this.views
      }
    });
  },
  data: {
    authenticated: false,
    content: {},
    displayId: null,
    showSplashScreen: true,
    views: []
  },
  created: function () {
    this.displayId = getIdentifier();
    this.$moment.locale('de');
    this.resetData();
  },
  mounted: function () {
    setupSocket(this.displayId);
    setTimeout(this.hideSplashScreen, 3000);
  },
  methods: {
    setAuthentication: function (state) {
      this.authenticated = state;
      if (state === false) {
        this.resetData();
      }
    },
    resetData: function () {
      this.content = {};
      this.views = [];
    },
    updateDataSource: function (id, data) {
      this.content[id] = data;
    },
    setViews: function (views) {
      if (!Array.isArray(views)) {
        return
      }

      this.views = views.filter(view => {
        try {
          validateView(view);
        } catch (e) {
          Vue.$toast.error(`View config rejected: ${e.message}`);
          return false;
        }

        return true;
      });

      console.log('views is now', this.views)
    },
    hideSplashScreen: function () {
      this.showSplashScreen = false;
    }
  }
}).$mount('#app');

function setupSocket(clientId) {
  socket = io({
    query: {
      clientId: clientId
    },
    timeout: 6000
  });

  socket.on('connect', function() {
    console.log('Connected to the server');
  });

  socket.on('connect_error', function(error) {
    console.error(error);
    Vue.$toast.error('Could not connect to the server');
  });

  socket.on('connect_timeout', function(timeout) {
    console.error(timeout);
    Vue.$toast.warning('Timeout');
  });

  socket.on('disconnect', function(reason) {
    console.error(reason);
    Vue.$toast.warning('Disconnected');
  });

  socket.on('error', function(err) {
    console.error(err);
    Vue.$toast.error('An error occurred, please check the logs');
  });

  socket.on('reconnect', function(attemptNumber) {
    console.log(`Successfully reconnected after ${attemptNumber} attempt(s)`);
    Vue.$toast.success('Connection reestablished');
  });

  socket.on('reconnect_attempt', function(attemptNumber) {
    console.log('Reconnection attempt', attemptNumber);
  });

  socket.on('reconnecting', function(attemptNumber) {
    console.log('Reconnecting', attemptNumber);
  });

  socket.on('reconnect_error', function(error) {
    console.error('Reconnect Error', error);
    Vue.$toast.error('Could not reconnect to the server');
  });

  socket.on('reconnect_failed', function() {
    console.error('Reconnect Failed');
    Vue.$toast.error('Reconnect failed');
  });

  socket.on('auth_error', function (error) {
    console.error('Auth error', error);
    vm.setAuthentication(false);
  });

  socket.on('auth_success', function (data) {
    console.log('Auth success', data);
    vm.setAuthentication(true);
  });

  socket.on('update_config', function(config) {
    console.log('Received config update', config);
    if (config.views) {
      vm.setViews(config.views)
    }
  });

  socket.on('update_data_source', function(update) {
    console.log('Received data source update', update);
    vm.updateDataSource(update.id, update.data);
  });
}

/**
 * Return the identifier of this display (i.e. browser). Creates one if it did not exist before.
 *
 * @return {string}
 */
function getIdentifier() {
  let identifier = localStorage.getItem('displayIdentifier');

  if (identifier === null) {
    console.log('Did not find display identifier, generating a new one...');
    identifier = generateIdentifier(8);
    localStorage.setItem('displayIdentifier', identifier);
  }

  return identifier;
}

/**
 * Generate a random string of a certain length consisting of digits and uppercase letters.
 *
 * @param length The desired number of characters of the generated string.
 *
 * @return {string}
 */
function generateIdentifier(length) {
  if (!length || length < 0) {
    return '';
  }

  let availableCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let identifier = '';
  for (let i = 0; i < length; i++) {
    let index = Math.floor(Math.random() * availableCharacters.length);
    identifier += availableCharacters[index];
  }

  return identifier;
}

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

  const validScreenTypes = ['IdleScreen']
  if (!Object.prototype.hasOwnProperty.call(view, 'screenType') || !validScreenTypes.includes(view.screenType)) {
    throw new Error('Screen type is not valid');
  }

  if (!Object.prototype.hasOwnProperty.call(view, 'columns') || view.columns < 1) {
    throw new Error('Number of columns is not valid');
  }

  if (!Object.prototype.hasOwnProperty.call(view, 'rows') || view.rows < 1) {
    throw new Error('Number of rows is not valid');
  }

  if (!Object.prototype.hasOwnProperty.call(view, 'components') || !Array.isArray(view.components) || view.components.length === 0) {
    throw new Error('No components specified');
  }

  const validComponents = ['AnnouncementList', 'Clock'];
  for (let component of view.components) {
    if (!component.name || !validComponents.includes(component.name)) {
      throw new Error('No valid component name specified');
    }

    if (!component.columnStart || !component.rowStart || !component.columnEnd || !component.rowEnd) {
      throw new Error('Not all bounds specified');
    }

    if (component.columnStart < 1 || component.rowStart < 1 || component.columnEnd > (view.columns + 1) || component.rowEnd > (view.rows + 1)) {
      throw new Error('Bounds exceed column/row count');
    }

    if (component.columnEnd <= component.columnStart || component.rowEnd <= component.rowStart) {
      throw new Error('Column/row end value must be greater that respective start value');
    }
  }
}
