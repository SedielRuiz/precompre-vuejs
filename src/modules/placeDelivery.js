import Vue from 'vue';

const state = {
  places: [],
  place: ""
};

const actions = {
    getPlace:({commit}, id) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('delivery_places/'+id).then(
            response =>{
                commit('setPlace',response.data);
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
    fetchPlaces:({commit}) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('delivery_places').then(
            response =>{
            commit('setPlaces',response.data);
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
        Vue.http.post('register_delivery_place',data).then(
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
        Vue.http.post('edit_delivery_place',data).then(
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
    getPlacess: (state) => (id) =>{
        let PlaceObj = state.places.find(element=>{
          return element._id == id
        })
        return PlaceObj;
    }
};

const mutations = {
    setPlaces: (state, list) => {
        state.places = list
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
