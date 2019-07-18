import Vue from 'vue';

const state = {
  productLists: [],
  productList: ""
};

const actions = {
    getProductList:({commit}, id) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('product_list/'+id).then(
            response =>{
                commit('setProductList',response.data);
                resolve(response.data)
            }
        ).catch(error=>{
            commit('setError', error, { root: true });
            reject(error)
        }).finally(()=>{
            commit('stopProcessing', null, { root: true });
        })
        });
    },
    fetchProductLists:({commit}) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('product_list').then(
            response =>{
                commit('setProductLists',response.data);
                resolve(response.data)
            }).catch(error=>{
                commit('setError', error, { root: true });
                reject(error)
            }).finally(()=>{
                commit('stopProcessing', null, { root: true });
            })
        });
    },
    create:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('register_product_list',data).then(
            response =>{
                resolve(response.data)
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
        Vue.http.post('edit_product_list',data).then(
            response =>{
            resolve(response.data)
            }
        ).catch(error=>{
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
        state.productLists = list
    },
    setProductList: (state, lst) => {
        state.productList = lst
    },

};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
