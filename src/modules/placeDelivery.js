import Vue from 'vue';
import User from '@/modules/user';

const state = {
  places: [],
  place: "",
  //Paginación
  page_size:"",
  total_items:"",
  total_pages:"",
};

const actions = {
    getPlace:({commit}, id) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('delivery_places/'+id).then(
            response =>{
                var data = User.actions.processResponse(response.data, false);
                commit('setPlace',data);
                resolve(data)
            }).catch(error=>{
                commit('setError', error, { root: true });
                reject(error)
            }).finally(()=>{
                commit('stopProcessing', null, { root: true });
            })
        });
    },
    fetchPlaces:({commit}, data) => {
        return new Promise((resolve, reject) => {
        Vue.http.post('delivery_places', data).then(
            response =>{
                var data = User.actions.processResponse(response.data, true);
                commit('setPlaces',data);
                resolve(data)
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
        Vue.http.post('register_delivery_place',data).then(
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
        Vue.http.post('edit_delivery_place',data).then(
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
    getPlacess: (state) => (id) =>{
        let PlaceObj = state.places.find(element=>{
          return element._id == id
        })
        return PlaceObj;
    }
};

const mutations = {
    setPlaces: (state, list) => {
        state.places = list.result_set;
        state.page_size = list.page_size;
        state.total_pages = list.total_pages;
        state.total_items = list.total_items;
    },
    setPlace: (state, att) => {
        state.place = att
    },

};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
