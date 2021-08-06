<template>
  <div class="container">
    <div v-if="animeList.length > 0" class="inner">
      <div class="left-col">
        <label for="search">Поиск</label>
        <input v-on:input="searchHandler" v-model="searchListener" id="search" type="text">
        <label for="genres">Жанры:</label>
        <select @change="genreHandler" v-model="selectedGenre" name="genres" id="genres">
          <option selected value="All">All</option>
          <option v-for="item in genres" :key="item" v-bind:value="item">
            {{item}}
          </option>
        </select>
        <ul v-if="searchListener === '' && selectedGenre === 'All'" class="anime-list">
          <li v-for="item in animeList" :key="item.id" class="anime-item">
            {{item.titles.en}}
            <input @change="favouritesHandler" class="favourites-input" v-bind:value="item.titles.en" v-bind:name="item.id" type="checkbox" hidden v-bind:id="item.id">
            <label class="addFavourites" v-bind:for="item.id">&#9733;</label>
          </li>
        </ul>
        <ul v-else-if="filteredArr.length > 0" class="anime-list">
          <li v-for="item in filteredArr" :key="item" class="anime-item">
            {{item}}
          </li>
        </ul>
        <div v-else class="error">
          <h2>Ничего не найдено</h2>
        </div>
      </div>
      <div class="right-col">
        <Favourites />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { computed, onBeforeMount, ref, watch } from 'vue'
import Favourites from './Favourites'
import createStore from '../store/index'
export default {
  name: 'DataList',
  components: { Favourites },
  setup () {
    const animeList = ref([])
    const searchListener = ref('')
    const itemTitles = ref([])
    const filteredArr = ref([])
    const genres = ref([])
    const selectedGenre = ref('All')
    const store = createStore
    const favouritesList = computed(() => store.getters.getFavouritesList)

    onBeforeMount(async () => {
      await axios.get('https://api.aniapi.com/v1/anime', {
        params: {
          _limit: 1000
        }
      })
        .then(response => {
          animeList.value = response.data.data.documents
          for (let i = 0; i < animeList.value.length; i++) {
            const item = animeList.value[i]
            itemTitles.value.push(item.titles.en)
          }
          console.log(animeList.value)
        })
      await axios.get('https://api.aniapi.com/v1/resources/1.0/0')
        .then(response => {
          genres.value = response.data.data.genres
        })
    })

    const subArr = filteredArr.value

    const searchHandler = () => {
      if (selectedGenre.value === 'All') {
        filteredArr.value = []
        for (let i = 0; i < itemTitles.value.length; i++) {
          if (itemTitles.value[i].indexOf(searchListener.value) > -1) {
            filteredArr.value.push(itemTitles.value[i])
          }
        }
      } else {
        filteredArr.value = []
        subArr.forEach(item => {
          if (item.indexOf(searchListener.value) > -1) {
            filteredArr.value.push(item)
          }
        })
      }
    }
    const genreHandler = () => {
      console.log(selectedGenre.value)
      if (searchListener.value === '') {
        for (let i = 0; i < animeList.value.length; i++) {
          animeList.value[i].genres.forEach(genre => {
            if (genre === selectedGenre.value) {
              filteredArr.value.push(animeList.value[i].titles.en)
            }
          })
        }
      } else {
        for (let i = 0; i < animeList.value.length; i++) {
          for (let j = 0; j < filteredArr.value.length; j++) {
            if (animeList.value[i].titles.en === filteredArr.value[j]) {
              for (let o = 0; o < animeList.value[i].genres.length; o++) {
                if (animeList.value[i].genres[o] === selectedGenre.value) {
                  filteredArr.value = []
                  filteredArr.value.push(animeList.value[i].titles.en)
                }
              }
            }
          }
        }
      }
    }
    const favouritesHandler = (e) => {
      e.target.classList.add('favourites--active')
      store.dispatch('addFavourite', e.target.getAttribute('value'))
    }

    watch(() => favouritesList.value, (list) => {
      const favourites = document.querySelectorAll('.favourites-input')
      favourites.forEach(f => {
        const favouriteName = f.getAttribute('value')
        if (list.indexOf(favouriteName) > -1) {
          f.classList.add('favourites--active')
        } else {
          f.classList.remove('favourites--active')
        }
      })
    })

    return {
      animeList,
      searchListener,
      searchHandler,
      filteredArr,
      genres,
      selectedGenre,
      genreHandler,
      favouritesHandler
    }
  }
}
</script>

<style>
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
.container{
  max-width: 1220px;
  margin: 0 auto;
}
ul{
  list-style-type: none;
}
  .inner{
    display: flex;
    align-items: flex-start;
  }
  .addFavourites{
    color: gray;
    background: none;
    border: none;
    cursor: pointer;
  }
  .favourites--active + .addFavourites{
    color: #aeae0d;
  }
</style>
