import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css'
import 'lib-flexible'
import uiEle from './plugins/vant-ui'
Object.keys(uiEle).forEach((key)=>{
  Vue.use(uiEle[key])
})
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
