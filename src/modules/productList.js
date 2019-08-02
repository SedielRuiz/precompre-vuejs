import Vue from 'vue';
import User from '@/modules/user';

const state = {
  productLists: [],
  productList: "",
  listFilter:[],
  listAttribute:[],
  products:[],
  //Paginación
  page_size:"",
  total_items:"",
  total_pages:"",
};

const actions = {
    searchProducts:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('consult_list_result_set',data).then(
            response =>{
                var data = User.actions.processResponse(response.data, false);
                commit('setProducts',data);
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
                var data = User.actions.processResponse(response.data, true);
                commit('setAttributes',data.result_set);
                resolve(data.result_set)
            }).catch(error=>{
                commit('setError', error, { root: true });
                reject(error)
            }).finally(()=>{
                commit('stopProcessing', null, { root: true });
            })
        });
    },
    consultModel:({commit}) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('consult_model_list_schema/product').then(
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
    getProductList:({commit}, id) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('model_lists/'+id).then(
            response =>{
                var data = User.actions.processResponse(response.data, false);
                commit('setProductList',data);
                resolve(data)
            }).catch(error=>{
                commit('setError', error, { root: true });
                reject(error)
            }).finally(()=>{
                commit('stopProcessing', null, { root: true });
            })
        });
    },
    fetchProductLists:({commit}, data) => {
        return new Promise((resolve, reject) => {
        Vue.http.post('model_lists', data).then(
            response =>{
                var data = User.actions.processResponse(response.data, true);
                commit('setProductLists',data);
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
        Vue.http.post('register_product_list',data).then(
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
        Vue.http.post('edit_model_list',data).then(
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
    setProductLists: (state, list) => {
        state.productLists = list.result_set;
        state.page_size = list.page_size;
        state.total_pages = list.total_pages;
        state.total_items = list.total_items;
    },
    setProductList: (state, lst) => {
        state.productList = lst
    },
    setModel: (state, mdl) => {
        state.listFilter = mdl
    },
    setAttributes: (state, att) => {
        state.listAttribute = att
    },
    setProducts: (state, pro) => {
        state.products = pro.result_set;
        state.page_size = pro.page_size;
        state.total_pages = pro.total_pages;
        state.total_items = pro.total_items;
    },
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
