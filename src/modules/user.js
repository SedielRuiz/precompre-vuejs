import Vue from 'vue';

const state = {
  users : [],
  user: "",
  publicity:[],
};

const actions = {
    getUser:({commit}, id) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('users/'+id).then(
            response =>{
            commit('setUser',response.data);
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
    fetchUsers:({commit}) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('users').then(
            response =>{
            commit('setUsers',response.data);
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
        Vue.http.post('register_user',data).then(
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
        Vue.http.post('edit_user',data).then(
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
    getPublicity: (state) => (code) =>{
        let publicity = state.publicity.find(element=>{
          return element.code == code
        })
        return publicity;
    }
};

const mutations = {
    setUsers: (state, list) => {
        state.users = list;
    },
    setUser: (state, us) => {
        state.user = us;
    },
    setPublicity: (state, pb) => {
        if(!getters.getPublicity(pb.code))
            state.publicity.push(pb);
    },

};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
