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
        <h2>Избранное</h2>
        <ul class="favourites_list">
          <li class="favourites_item">
            asd
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { onBeforeMount, ref } from 'vue'
export default {
  name: 'DataList',
  setup () {
    const animeList = ref([])
    const searchListener = ref('')
    const itemTitles = ref([])
    const filteredArr = ref([])
    const genres = ref([])
    const selectedGenre = ref('All')

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

    const searchHandler = () => {
      filteredArr.value = []
      for (let i = 0; i < itemTitles.value.length; i++) {
        if (itemTitles.value[i].indexOf(searchListener.value) > -1) {
          filteredArr.value.push(itemTitles.value[i])
        }
      }
    }
    const genreHandler = () => {
      console.log(selectedGenre.value)
      for (let i = 0; i < animeList.value.length; i++) {
        animeList.value[i].genres.forEach(genre => {
          if (genre === selectedGenre.value) {
            console.log(animeList.value[i].titles.en)
            filteredArr.value.push(animeList.value[i].titles.en)
          }
        })
      }
    }
    return {
      animeList,
      searchListener,
      searchHandler,
      filteredArr,
      genres,
      selectedGenre,
      genreHandler
    }
  }
}
</script>

<style scoped>
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
.container{
  max-width: 1220px;
  margin: 0 auto;
}
  .inner{
    display: flex;
    align-items: flex-start;
  }
</style>
