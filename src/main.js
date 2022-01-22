import Vue from 'vue';
import Snotify, { SnotifyPosition } from 'vue-snotify'; // 1. Import Snotify
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

import 'vue-snotify/styles/material.css';
import '@/assets/scss/main.scss';

Vue.config.productionTip = false;

const snotifyOptions = {
  toast: {
    position: SnotifyPosition.rightBottom,
  },
};
Vue.use(Snotify, snotifyOptions);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
