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
