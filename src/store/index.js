import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    Shoppingcartnum: 0,//购物车数量
    isLoad: false,//判断是否需要获取购物车数量
  },
  mutations: {
    //改变购物车数量
    changenum(state, data) {
      state.Shoppingcartnum = data;
    },
    //改变isLoad状态
    changeBoll(state, data) {
      state.isLoad = data;
    },

  },
  actions: {
  },
  modules: {
  }
})
