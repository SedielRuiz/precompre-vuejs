import Vue from 'vue';
import User from '@/modules/user';

const state = {
  preOrders: [],
  preOrder: "",
  //Paginación
  page_size:"",
  total_items:"",
  total_pages:"",
};

const actions = {
    getPreOrder:({commit}, id) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('pre_orders/'+id).then(
            response =>{
                var data = User.actions.processResponse(response.data, false);
                commit('setPreOrder',data);
                resolve(data)
            }).catch(error=>{
                commit('setError', error, { root: true });
                reject(error)
            }).finally(()=>{
                commit('stopProcessing', null, { root: true });
            })
        });
    },
    fetchPreOrders:({commit}) => {
        return new Promise((resolve, reject) => {
        Vue.http.post('pre_orders').then(
            response =>{
                var data = User.actions.processResponse(response.data, true);
                commit('setPreOrders',data);
                resolve(data)
            }).catch(error=>{
                commit('setError', error, { root: true });
                reject(error)
            }).finally(()=>{
            })
        });
    },
    fetchPreOrdersCustomer:({commit}, id) => {
        return new Promise((resolve, reject) => {
        Vue.http.post('pre_orders_customer/'+id).then(
            response =>{
                var data = User.actions.processResponse(response.data, true);
                commit('setPreOrders',data);
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
        Vue.http.post('register_pre_order',data).then(
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
        Vue.http.post('edit_pre_order',data).then(
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
    setPreOrders: (state, list) => {
        state.preOrders = list.result_set;
        state.page_size = list.page_size;
        state.total_pages = list.total_pages;
        state.total_items = list.total_items;
    },
    setPreOrder: (state, ord) => {
        state.preOrder = ord
    },

};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
