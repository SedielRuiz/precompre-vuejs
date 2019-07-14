import Vue from 'vue';

const state = {
  products: [],
  product: "",
  attrClass:""
};

const actions = {
    getProductClassAttribute:({commit}, id) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('product_class_attributes/'+id).then(
            response =>{
            commit('ProductClassAttribute',response.data);
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
    getProduct:({commit}, id) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('products/'+id).then(
            response =>{
            commit('setProduct',response.data);
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
    fetchProducts:({commit}) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('products').then(
            response =>{
            commit('setProducts',response.data);
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
    create:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('register_product',data).then(
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
    
    update:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('edit_product',data).then(
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
};

const mutations = {
    setProducts: (state, list) => {
        state.products = list
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
