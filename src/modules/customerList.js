import Vue from 'vue';
import User from '@/modules/user';

const state = {
  customerLists: [],
  customerList: "",
  listFilter:[],
  listAttribute:[],
  customers:[],
  //Paginación
  page_size:"",
  total_items:"",
  total_pages:"",
};

const actions = {
    searchCustomers:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post('search_customer',data).then(
                response =>{
                    var data = User.actions.processResponse(response.data, false);
                    commit('setCustomers',data);
                    resolve(data)
                }).catch(error=>{
                    commit('setError', error, { root: true });
                    reject(error)
                }).finally(()=>{
                    commit('stopProcessing', null, { root: true });
                })
        });
    },
    consultAttributes:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('search_product_attribute_schema',data).then(
            response =>{
                var data = User.actions.processResponse(response.data, false);
                commit('setAttributes',data);
                resolve(data)
            }).catch(error=>{
                commit('setError', error, { root: true });
                reject(error)
            }).finally(()=>{
                commit('stopProcessing', null, { root: true });
            })
        });
    },
    consultModel:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('consult_model_list_schema/customer',data).then(
            response =>{
                var data = User.actions.processResponse(response.data, false);
                commit('setModel',data);
                resolve(data)
            }).catch(error=>{
                commit('setError', error, { root: true });
                reject(error)
            }).finally(()=>{
                commit('stopProcessing', null, { root: true });
            })
        });
    },
    getCustomerList:({commit}, id) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('customer_list/'+id).then(
            response =>{
                var data = User.actions.processResponse(response.data, false);
                commit('setCustomerList',data);
                resolve(data)
            }).catch(error=>{
                commit('setError', error, { root: true });
                reject(error)
            }).finally(()=>{
                commit('stopProcessing', null, { root: true });
            })
        });
    },
    fetchCustomerLists:({commit}, data) => {
        return new Promise((resolve, reject) => {
        Vue.http.post('product_list', data).then(
            response =>{
                var data = User.actions.processResponse(response.data, true);
                commit('setCustomerLists',data);
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
        Vue.http.post('register_customer_list',data).then(
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
        Vue.http.post('edit_customer_list',data).then(
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
    getLists: (state) => (id) =>{
        let attributesObj = state.attributes.find(element=>{
          return element._id == id
        })
        return attributesObj;
    }
};

const mutations = {
    setCustomerLists: (state, list) => {
        state.customerLists = list.result_set;
        state.page_size = list.page_size;
        state.total_pages = list.total_pages;
        state.total_items = list.total_items;
    },
    setCustomerList: (state, lst) => {
        state.customerList = lst
    },
    setModel: (state, mdl) => {
        state.listFilter = mdl
    },
    setAttributes: (state, att) => {
        state.listAttribute = att
    },
    setCustomers: (state, cs) => {
        state.customers = cs
    },
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
