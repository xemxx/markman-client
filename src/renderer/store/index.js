import Vuex from 'vuex'
import modules from './modules/index.js'

const store = Vuex.createStore({
  state: {
    online: navigator.onLine,
    platform: process.env.platform,
  },
  mutations: {
    update_online(state, value) {
      state.online = value
    },
  },
  modules,
})

//添加对联网状态的更新
window.addEventListener('online', () => store.commit('update_online', true))
window.addEventListener('offline', () => store.commit('update_online', false))

export default store
