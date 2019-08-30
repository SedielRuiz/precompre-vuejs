import Vue from 'vue';
import User from '@/modules/user';

const state = {
  comandas: [],
  comanda: "",
  //Paginación
  page_size:"",
  total_items:"",
  total_pages:"",
};

const actions = {
    getComanda:({commit}, id) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('comanda/'+id).then(
            response =>{
                var data = User.actions.processResponse(response.data, false);
                commit('setComanda',data);
                resolve(data)
            }).catch(error=>{
                commit('setError', error, { root: true });
                reject(error)
            }).finally(()=>{
                commit('stopProcessing', null, { root: true });
            })
        });
    },
    fetchComandas:({commit}) => {
        return new Promise((resolve, reject) => {
        Vue.http.post('comandas').then(
            response =>{
                var data = User.actions.processResponse(response.data, true);
                commit('setComandas',data);
                resolve(data)
            }).catch(error=>{
                commit('setError', error, { root: true });
                reject(error)
            }).finally(()=>{
            })
        });
    },
    
    update:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('edit_comanda',data).then(
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
    setComandas: (state, list) => {
        state.comandas = list.result_set;
        state.page_size = list.page_size;
        state.total_pages = list.total_pages;
        state.total_items = list.total_items;
    },
    setComanda: (state, ord) => {
        state.comanda = ord
    },

};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
