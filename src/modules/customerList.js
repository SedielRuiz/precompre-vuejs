import Vue from 'vue';

const state = {
  customerLists: [],
  customerList: "",
  listFilter:[],
  listAttribute:[],
  customers:[]
};

const actions = {
    searchCustomers:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post('search_customer',data).then(
                response =>{
                    commit('setCustomers',response.data);
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
        Vue.http.post('consult_model_list_schema/customer',data).then(
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
    getCustomerList:({commit}, id) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('customer_list/'+id).then(
            response =>{
                commit('setCustomerList',response.data);
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
    fetchCustomerLists:({commit}) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('product_list').then(
            response =>{
                commit('setCustomerLists',response.data);
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
        Vue.http.post('register_customer_list',data).then(
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
        Vue.http.post('edit_customer_list',data).then(
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
    setCustomerLists: (state, list) => {
        state.customerLists = list
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
