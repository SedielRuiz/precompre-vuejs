import Vue from 'vue';

const state = {
  customers: [],
  customer: ""
};

const actions = {
    getCustomer:({commit}, id) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('customers/'+id).then(
            response =>{
                commit('setCustomer',response.data);
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
    fetchCustomers:({commit}) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('customers').then(
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
    create:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('register_customer',data).then(
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
        Vue.http.post('edit_customer',data).then(
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
    getCustomers: (state) => (id) =>{
        let PlaceObj = state.places.find(element=>{
          return element._id == id
        })
        return PlaceObj;
    }
};

const mutations = {
    setCustomers: (state, list) => {
        state.customers = list
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
