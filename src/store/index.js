import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    categories: {},
    forums: {},
    posts: {},
    users: {},
    authId: null,
    unsubscribeAuthObserver: null
  },

  getters,

  actions,

  mutations
})
