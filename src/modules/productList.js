import Vue from 'vue';

const state = {
  productLists: [],
  productList: "",
  listFilter:[],
  listAttribute:[],
  products:[]
};

const actions = {
    searchProducts:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post('search_product',data).then(
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
    consultAttributes:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('search_product_attribute_schema',data).then(
            response =>{
                commit('setAttributes',response.data);
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
    consultModel:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('consult_model_list_schema/product',data).then(
            response =>{
                commit('setModel',response.data);
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
    setModel: (state, mdl) => {
        state.listFilter = mdl
    },
    setAttributes: (state, att) => {
        state.listAttribute = att
    },
    setProducts: (state, pro) => {
        state.products = pro
    },
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
