import Vue from 'vue';
import User from '@/modules/user';

const state = {
  orders: [],
  order: "",
  //Paginación
  page_size:"",
  total_items:"",
  total_pages:"",
};

const actions = {
    getOrder:({commit}, id) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('order/'+id).then(
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
    fetchOrders:({commit}) => {
        return new Promise((resolve, reject) => {
        Vue.http.post('order').then(
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
        Vue.http.post('edit_customer',data).then(
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
    setOrders: (state, list) => {
        state.orders = list.result_set;
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
