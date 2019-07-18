import Vue from 'vue';

const state = {
    categories: [],
    category: ""
};

const actions = {
    getCategory:({commit}, id) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('categories/'+id).then(
            response =>{
                commit('setCategory',response.data);
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
    fetchCategories:({commit}) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('categories').then(
            response =>{
                commit('setCategories',response.data);
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
        Vue.http.post('register_category',data).then(
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
        Vue.http.post('edit_category',data).then(
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
    getCategories: (state) => (id) =>{
        let categoryObj = state.categories.find(element=>{
          return element._id == id
        })
        return categoryObj;
    }
};

const mutations = {
    setCategories: (state, list) => {
        state.categories = list
    },
    setCategory: (state, ct) => {
        state.category = ct
    },

};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
