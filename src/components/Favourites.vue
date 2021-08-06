<template>
  <h2>Избранное</h2>
  <ul class="favourites_list">
    <li v-for="item in favouritesList" :key="item" class="favourites_item">
      {{item}}
      <input @change="favouritesHandler" v-bind:value="item" v-bind:name="item" type="checkbox" hidden v-bind:id="item">
      <label v-bind:for="item">&#10060;</label>
    </li>
  </ul>
</template>

<script>
import createStore from '../store'
import { computed } from 'vue'

export default {
  name: 'Favourites',
  setup () {
    const store = createStore
    const favouritesList = computed(() => store.getters.getFavouritesList)

    const favouritesHandler = (e) => {
      const idx = favouritesList.value.indexOf(e.target.getAttribute('value'))
      store.dispatch('removeFavourite', idx)
    }
    return {
      favouritesList,
      favouritesHandler
    }
  }
}
</script>

<style scoped>
  label{
    cursor: pointer;
  }
</style>
