import Vue from 'vue'
import App from './App.vue'
import io from 'socket.io-client'
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/index.css';

Vue.use(VueToast);

Vue.config.productionTip = false;

let socket;

new Vue({
  render: h => h(App),
  data: {
    displayId: null
  },
  created: function () {
    this.displayId = getIdentifier();
  },
  mounted: function () {
    setupSocket();
  }
}).$mount('#app');

function setupSocket() {
  socket = io();

  socket.on('connect_error', function() {
    Vue.$toast.error('Could not connect to the server');
  });

  socket.on('reconnect_error', function() {
    Vue.$toast.error('Could not reconnect to the server');
  });

  socket.on('reconnecting', function() {
    Vue.$toast.success('Reconnected to server');
  });

  socket.on('test message', function(data) {
    console.log('Received data', data);
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
