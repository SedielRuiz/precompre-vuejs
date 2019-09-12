import Vue from 'vue';
import User from '@/modules/user';

const state = {
    groups: [],
    group: "",
    //Paginación
    page_size:"",
    total_items:"",
    total_pages:"",
};

const actions = {
    getGroup:({commit}, id) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('customer_groups/'+id).then(
            response =>{
                var data = User.actions.processResponse(response.data, false);
                commit('setGroup',data);
                resolve(data)
            }).catch(error=>{
                commit('setError', error, { root: true });
                reject(error)
            }).finally(()=>{
                commit('stopProcessing', null, { root: true });
            })
        });
    },
    fetchGroups:({commit}) => {
        return new Promise((resolve, reject) => {
        Vue.http.post('customer_groups').then(
            response =>{
                var data = User.actions.processResponse(response.data, true);
                commit('setGroups',data);
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
        Vue.http.post('register_customer_group',data).then(
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
        Vue.http.post('edit_customer_group',data).then(
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
        Vue.http.post('delete_customer_group/'+data).then(
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
    getGroups: (state) => (id) =>{
        let groupObj = state.groups.find(element=>{
          return element._id == id
        })
        return groupObj;
    }
};

const mutations = {
    setGroups: (state, list) => {
        state.groups = list.result_set;
        state.page_size = list.page_size;
        state.total_pages = list.total_pages;
        state.total_items = list.total_items;
    },
    setGroup: (state, grp) => {
        state.group = grp
    },

};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
