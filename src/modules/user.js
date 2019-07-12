import Vue from 'vue';

const state = {
  list : [],
};

const actions = {
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
      Vue.http.post('register',data).then(
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
      Vue.http.post('users/edit',data).then(
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
  getUser: (state) => (id) =>{
      console.log("id es: " + id);
    let user = state.list.find(element=>{
      return element._id == id
    }) 
    return user
  },
  getPhones:(state) => (id) =>{
      let user = state.list.find(element=>{
        return element._id == id
      }) 
      return JSON.parse(user.phones)
  }
};

const mutations = {
    setUsers: (state, list) => {
        state.users = list
    },

};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
