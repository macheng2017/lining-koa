import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import config from '../config'
Vue.use(Vuex)
const store = () => {
  return new Vuex.Store({
    state: {
      // imageCDN: 'http://papgjolja.bkt.clouddn.com/'
      imageCDN: config.imageCDN,
      defImg: config.defImg
      // houses: [],
      // // cities: [],
      // characters: [],
      // products: [],
      // currentProduct: [],
      // user: null,
      // currentHouse: {},
      // currentCharacter: {},
      // authUser: null
    },
    getters,
    actions,
    mutations
  })
}

export default store
