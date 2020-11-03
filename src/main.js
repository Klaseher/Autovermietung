// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// Ist einfach die Main-Methode
import Vue from 'vue'
import App from './App'
import router from './router'
import Axios from 'axios'

// Axios global verfügbar machen in allen Komponenten -> wichtig für crud-Methoden
// zur Kommunikation mit Express-Server Backend
Vue.prototype.$http = Axios

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
