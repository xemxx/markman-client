import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './plugins/viewui.js'
import './plugins/sqlite3/db.js'
import './plugins/axios.js'

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (to.matched.some(m => m.meta.auth)) {
    if (store.state.user.token === '') {
      next({ path: '/signin' });
    } else {
      next();
    }
  } else {
    next();
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
