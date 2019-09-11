import Vue from 'vue';
import User from '@/modules/user';

const state = {
    categories: [],
    category: "",
    //Paginación
    page_size:"",
    total_items:"",
    total_pages:"",
};

const actions = {
    getCategory:({commit}, id) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('categories/'+id).then(
            response =>{
                var data = User.actions.processResponse(response.data, false);
                commit('setCategory',data);
                resolve(data)
            }).catch(error=>{
                commit('setError', error, { root: true });
                reject(error)
            }).finally(()=>{
                commit('stopProcessing', null, { root: true });
            })
        });
    },
    fetchCategories:({commit}, data) => {
        return new Promise((resolve, reject) => {
        Vue.http.post('categories', data).then(
            response =>{
                var data = User.actions.processResponse(response.data, true);
                commit('setCategories',data);
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
        Vue.http.post('register_category',data).then(
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
        Vue.http.post('edit_category',data).then(
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
        Vue.http.post('delete_category/'+data).then(
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
    getCategories: (state) => (id) =>{
        let categoryObj = state.categories.find(element=>{
          return element._id == id
        })
        return categoryObj;
    }
};

const mutations = {
    setCategories: (state, list) => {
        state.categories = list.result_set;
        state.page_size = list.page_size;
        state.total_pages = list.total_pages;
        state.total_items = list.total_items;
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
