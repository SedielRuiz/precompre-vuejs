import Vue from 'vue';
import User from '@/modules/user';

const state = {
  permissions: [],
  permission: "",
  //Paginación
  page_size:"",
  total_items:"",
  total_pages:"",
};

const actions = {
    getPermission:({commit}, id) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('permissions/'+id).then(
            response =>{
                var data = User.actions.processResponse(response.data, false);
                commit('setPermission',data);
                resolve(data)
            }).catch(error=>{
                commit('setError', error, { root: true });
                reject(error)
            }).finally(()=>{
                commit('stopProcessing', null, { root: true });
            })
        });
    },
    fetchPermissions:({commit}, data) => {
        return new Promise((resolve, reject) => {
        Vue.http.post('permissions', data).then(
            response =>{
                var data = User.actions.processResponse(response.data, true);
                commit('setPermissions',data);
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
        Vue.http.post('register_permission',data).then(
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
        Vue.http.post('edit_permission',data).then(
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
    getPermissions: (state) => (id) =>{
        let permissionObj = state.permissions.find(element=>{
          return element._id == id
        })
        return permissionObj;
    }
};

const mutations = {
    setPermissions: (state, list) => {
        state.permissions = list.result_set;
        state.page_size = list.page_size;
        state.total_pages = list.total_pages;
        state.total_items = list.total_items;
    },
    setPermission: (state, per) => {
        state.permission = per
    },

};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
