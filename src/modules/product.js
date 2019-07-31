import Vue from 'vue';
import User from '@/modules/user';

const state = {
  products: [],
  product: "",
  attrClass:"",
  //Paginación
  page_size:"",
  total_items:"",
  total_pages:"",
};

const actions = {
    getProductClassAttribute:({commit}, id) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('product_class_attributes/'+id).then(
            response =>{
                var data = User.actions.processResponse(response.data, false);
                commit('ProductClassAttribute',data);
                resolve(data)
            }).catch(error=>{
                commit('setError', error, { root: true });
                reject(error)
            }).finally(()=>{
                commit('stopProcessing', null, { root: true });
            })
        });
    },
    getProduct:({commit}, id) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('products/'+id).then(
            response =>{
                var data = User.actions.processResponse(response.data, false);
                commit('setProduct',data);
                resolve(data)
            }).catch(error=>{
                commit('setError', error, { root: true });
                reject(error)
            }).finally(()=>{
                commit('stopProcessing', null, { root: true });
            })
        });
    },
    fetchProducts:({commit}, data) => {
        return new Promise((resolve, reject) => {
        Vue.http.post('products', data).then(
            response =>{
                var data = User.actions.processResponse(response.data, true);
                commit('setProducts',response.data);
                resolve(response.data)
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
        Vue.http.post('register_product',data).then(
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
        Vue.http.post('edit_product',data).then(
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
};

const mutations = {
    setProducts: (state, list) => {
        state.products = list.result_set;
        state.page_size = list.page_size;
        state.total_pages = list.total_pages;
        state.total_items = list.total_items;
    },
    setProduct: (state, pr) => {
        state.product = pr
    },
    ProductClassAttribute(state, attr){
        state.attrClass = attr
    }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
