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
        screenConfigs: this.screenConfigs,
        showSplashScreen: this.showSplashScreen
      }
    });
  },
  data: {
    authenticated: false,
    displayId: null,
    showSplashScreen: true,
    screenConfigs: {
      'IdleScreen': {
        columns: 3,
        rows: 3,
        components: [
          {name: 'Clock', coords: [1,2,2,3]},
          {name: 'Clock', coords: [2,3,3,4]}
        ]
      }
    }
  },
  created: function () {
    this.displayId = getIdentifier();
    this.$moment.locale('de');
  },
  mounted: function () {
    setupSocket(this.displayId);
    setTimeout(this.hideSplashScreen, 3000);
  },
  methods: {
    setAuthentication: function (state) {
      this.authenticated = state;
    },
    hideSplashScreen: function () {
      this.showSplashScreen = false;
    }
  }
}).$mount('#app');

function setupSocket(displayId) {
  socket = io({
    query: {
      displayId: displayId
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

  socket.on('test message', function(data) {
    console.log('Received data', data);
  });

  socket.on('auth_error', function (error) {
    console.error('Auth error', error);
    vm.setAuthentication(false);
  });

  socket.on('auth_success', function (data) {
    console.log('Auth success', data);
    vm.setAuthentication(true);
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
