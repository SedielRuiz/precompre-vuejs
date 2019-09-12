import Vue from 'vue';
import User from '@/modules/user';

const state = {
    campaigns: [],
    campaign: "",
    //Paginación
    page_size:"",
    total_items:"",
    total_pages:"",
};

const actions = {
    getCampaign:({commit}, id) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('campaign/'+id).then(
            response =>{
                var data = User.actions.processResponse(response.data, false);
                commit('setCampaign',data);
                resolve(data)
            }).catch(error=>{
                commit('setError', error, { root: true });
                reject(error)
            }).finally(()=>{
                commit('stopProcessing', null, { root: true });
            })
        });
    },
    fetchCampaigns:({commit}) => {
        return new Promise((resolve, reject) => {
        Vue.http.post('campaigns').then(
            response =>{
                var data = User.actions.processResponse(response.data, true);
                commit('setCampaigns',data);
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
    getCampaigns: (state) => (id) =>{
        let groupObj = state.groups.find(element=>{
          return element._id == id
        })
        return groupObj;
    }
};

const mutations = {
    setCampaigns: (state, list) => {
        state.campaigns = list.result_set;
        state.page_size = list.page_size;
        state.total_pages = list.total_pages;
        state.total_items = list.total_items;
    },
    setCampaign: (state, cmp) => {
        state.campaign = cmp
    },

};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
