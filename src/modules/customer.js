import Vue from 'vue';
import User from '@/modules/user';

const state = {
  customers: [],
  customer: "",
  //Paginación
  page_size:"",
  total_items:"",
  total_pages:"",
};

const actions = {
    getCustomer:({commit}, id) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('customers/'+id).then(
            response =>{
                var data = User.actions.processResponse(response.data, false);
                commit('setCustomer',data);
                resolve(data)
            }).catch(error=>{
                commit('setError', error, { root: true });
                reject(error)
            }).finally(()=>{
                commit('stopProcessing', null, { root: true });
            })
        });
    },
    fetchCustomers:({commit}, data) => {
        return new Promise((resolve, reject) => {
        Vue.http.post('customers', data).then(
            response =>{
                var data = User.actions.processResponse(response.data, true);
                commit('setCustomers',data);
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
        Vue.http.post('register_customer',data).then(
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

    delete:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('delete_customer/'+data).then(
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

    resetPassword:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post('reset_password_customer', data).then(
                response =>{
                    var data = User.actions.processResponse(response.data, false);
                    resolve(data)
                }
            ).catch(error=>{
                commit('setError', error, { root: true });
                reject(error)
            }).finally(()=>{
                commit('stopProcessing', null, { root: true });
            })
        });
    },

    findCode:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post('consult_verification_code/'+ data).then(
                response =>{
                    var data = User.actions.processResponse(response.data, false);
                    resolve(data)
                }
            ).catch(error=>{
                commit('setError', error, { root: true });
                reject(error)
            }).finally(()=>{
                commit('stopProcessing', null, { root: true });
            })
        });
    },

    verifyCode:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post('verify_code', data).then(
                response =>{
                    var data = User.actions.processResponse(response.data, false);
                    resolve(data)
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
    getCustomers: (state) => (id) =>{
        let PlaceObj = state.places.find(element=>{
          return element._id == id
        })
        return PlaceObj;
    }
};

const mutations = {
    setCustomers: (state, list) => {
        state.customers = list.result_set;
        state.page_size = list.page_size;
        state.total_pages = list.total_pages;
        state.total_items = list.total_items;
    },
    setCustomer: (state, cus) => {
        state.customer = cus
    },

};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
