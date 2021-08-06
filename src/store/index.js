import { createStore } from 'vuex'

export default createStore({
  state: {
    favouritesList: []
  },
  mutations: {
    FavouriteHandler (state, elem) {
      state.favouritesList.push(elem)
    },
    removeFavourite (state, idx) {
      state.favouritesList.splice(idx, 1)
    }
  },
  actions: {
    addFavourite (context, elem) {
      context.commit('FavouriteHandler', elem)
    },
    removeFavourite (context, idx) {
      context.commit('removeFavourite', idx)
    }
  },
  modules: {
  },
  getters: {
    getFavouritesList: state => {
      return state.favouritesList.filter((item, index) => state.favouritesList.indexOf(item) === index)
    }
  }
})
