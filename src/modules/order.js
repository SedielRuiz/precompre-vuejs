import Vue from 'vue';
import User from '@/modules/user';

const state = {
  orders: [],
  order: "",
  bills:[],
  //Paginación
  page_size:"",
  total_items:"",
  total_pages:"",
};

const actions = {
    getOrder:({commit}, id) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('orders/'+id).then(
            response =>{
                var data = User.actions.processResponse(response.data, false);
                commit('setOrder',data);
                resolve(data)
            }).catch(error=>{
                commit('setError', error, { root: true });
                reject(error)
            }).finally(()=>{
                commit('stopProcessing', null, { root: true });
            })
        });
    },
    fetchOrdersCustomer:({commit}, id) => {
        return new Promise((resolve, reject) => {
        Vue.http.post('orders_customer/'+ id).then(
            response =>{
                var data = User.actions.processResponse(response.data, true);
                commit('setOrders',data);
                resolve(data)
            }).catch(error=>{
                commit('setError', error, { root: true });
                reject(error)
            }).finally(()=>{
            })
        });
    },
    fetchOrders:({commit}, data) => {
        return new Promise((resolve, reject) => {
        Vue.http.post('orders', data).then(
            response =>{
                var data = User.actions.processResponse(response.data, true);
                commit('setOrders',data);
                resolve(data)
            }).catch(error=>{
                commit('setError', error, { root: true });
                reject(error)
            }).finally(()=>{
            })
        });
    },
    create:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('register_order',data).then(
            response =>{
                var data = User.actions.processResponse(response.data, false);
                resolve(data)
            }).catch(error=>{
                commit('setError', error, { root: true });
                reject(error)
            }).finally(()=>{
                commit('stopProcessing', null, { root: true });
            })
        });
    },
    
    update:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('edit_order',data).then(
            response =>{
                var data = User.actions.processResponse(response.data, false);
                resolve(data)
            }).catch(error=>{
                commit('setError', error, { root: true });
                reject(error)
            }).finally(()=>{
                commit('stopProcessing', null, { root: true });
            })
        });
    },
    delete:({commit}, id) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('delete_order/'+id).then(
            response =>{
                var data = User.actions.processResponse(response.data, false);
                resolve(data)
            }).catch(error=>{
                commit('setError', error, { root: true });
                reject(error)
            }).finally(()=>{
                commit('stopProcessing', null, { root: true });
            })
        });
    },
    /*****************Facturas**************/
    fetchBills:({commit}, data) => {
        return new Promise((resolve, reject) => {
        Vue.http.post('bills', data).then(
            response =>{
                var data = User.actions.processResponse(response.data, true);
                commit('setBills',data);
                resolve(data)
            }).catch(error=>{
                commit('setError', error, { root: true });
                reject(error)
            }).finally(()=>{
            })
        });
    },
  
};

const getters = {
    getOrders: (state) => (id) =>{
        let PlaceObj = state.places.find(element=>{
          return element._id == id
        })
        return PlaceObj;
    }
};

const mutations = {
    setOrders: (state, list) => {
        state.orders = list.result_set;
        state.page_size = list.page_size;
        state.total_pages = list.total_pages;
        state.total_items = list.total_items;
    },
    setBills: (state, list) => {
        state.bills = list.result_set;
        state.page_size = list.page_size;
        state.total_pages = list.total_pages;
        state.total_items = list.total_items;
    },
    setOrder: (state, ord) => {
        state.order = ord
    },

};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
