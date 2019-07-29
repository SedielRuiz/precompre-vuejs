import Vue from 'vue';
import store from '@/store';

const state = {
  users : [],
  user: "",
  //Paginación
  page_number:"",
  page_size:"",
  total_items:"",
  total_pages:"",
  //Publicidad
  publicity:[],
  noPublicity:[],
};

const actions = {
    getUser:({commit}, id) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('users/'+id).then(
            response =>{
                var data = actions.processResponse(response.data, false);
                commit('setUser',data);
                resolve(data)
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
                var data = actions.processResponse(response.data, true);
                commit('setUsers', data);
                resolve(data)
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
                var data = actions.processResponse(response.data, true);
                resolve(data)
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
                var data = actions.processResponse(response.data, true);
                resolve(data)
            }
        ).catch(error=>{
            commit('setError', error, { root: true });
            reject(error)
        }).finally(()=>{
            commit('stopProcessing', null, { root: true });
        })
        });
    },

    processResponse:(body, pag) => {
        console.log(body);
        if(body){
            if(body.warning){
                store.setWarning(body.warning);
            }
            if(body.info){
                actions.setPublicity(body.info);
            }
        }
        if(pag){
            return {"result_set":body.result_set, "page_number":body.page_number, "page_size":body.page_size, "total_items":body.total_items, "total_pages":body.total_pages};
        }else{return body.result_set[0];}
    },

    setPublicity:({state}, pbl) => {
        console.log(pbl);
        for(var s = 0; s < pbl.length; s++){
            let publicity = state.noPublicity.find(element=>{return element.code == pbl[s].code})
            if(!publicity){
                state.publicity.push(pbl[s]);
            }
        }
        for(var s = 0; s < state.publicity.length; s++){state.noPublicity.push(state.publicity[s]);}
    }
  
};
const getters = {
};

const mutations = {
    setUsers: (state, list) => {
        state.users = list.result_set;
        state.page_number = list.page_number;
        state.page_size = list.page_size;
        state.total_pages = list.total_pages;
        state.total_items = list.total_items;
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
