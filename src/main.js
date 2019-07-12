import Vue from 'vue'
import App from './App.vue'
import './plugins/vuetify'
import config from './config'
import store from './store'
import router from './router'

Vue.config.productionTip = false

//vue resource
import VueResource from 'vue-resource';
Vue.use(VueResource);

Vue.http.options.root = config.ROOT_API;
Vue.http.interceptors.push((request, next) => {
  request.headers.set('Authorization', `Bearer ${window.localStorage.getItem('_token')}`);
  next();
});
//.vue resource

//blockui
import BlockUI from 'vue-blockui';
Vue.use(BlockUI);
//.blockui


//vee-validate
import VeeValidate, {Validator} from 'vee-validate';
Vue.use(VeeValidate);
//.vee-validate

new Vue({
  el: '#app',
  render: h => h(App),
  store,
	router,
})
