import Vue from 'vue'
import router from './router'
import Vuex from 'vuex'
Vue.use(Vuex)

//MODULOS
import auth from '@/modules/auth';
import user from '@/modules/user';
import role from '@/modules/role';
import permission from '@/modules/permission';
import productAttribute from '@/modules/productAttribute';
import productClass from '@/modules/productClass';
import product from '@/modules/product';
import placeDelivery from '@/modules/placeDelivery';
import customer from '@/modules/customer';
import group from '@/modules/group';
import category from '@/modules/category';
import productList from '@/modules/productList';
import customerList from '@/modules/customerList';
import order from '@/modules/order';
import preOrder from '@/modules/preOrder';
import comanda from '@/modules/comanda';

const store = new Vuex.Store({
  state: {
    processing: false,
    warning: null,
    error: null
  },
  getters:{

  },
  mutations: {
    startProcessing (state) {
      state.processing = true;
    },
    stopProcessing (state) {
      state.processing = false;
    },
    setError (state, responseApi) {
      if(responseApi.data){
        let data = responseApi.data;
        if(data.error){
          console.log(data.error.dev);
          if(data.error.message){
            if(data.error.name && data.error.name=='InvalidJwtToken'){
              state.error = 'Acceso no autorizado. Debe autenticarse nuevamente.';
              this.dispatch('auth/logout')
              router.push('/login')
            }else{
              state.error = data.error.user;  
            }
          }else{
            state.error = data.error.user;
          }  
        }else{
          state.error = data;
        }
      }else{
        state.error = responseApi;
      }
      setTimeout(() => {
        state.error = null
      },3000)
    }
  },
  actions: {
    setWarning ({state}, value) {
      state.warning = value
      return new Promise((resolve) => {
        setTimeout(function () {
          state.warning = null
          resolve()
        }, 2000)
      })
    }
  },
  modules: {
    auth,
    user,
    role,
    permission,
    productAttribute,
    productClass,
    product,
    placeDelivery,
    customer,
    group,
    category,
    productList,
    customerList,
    order,
    preOrder,
    comanda,
  }
})


export default store;