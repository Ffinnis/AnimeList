<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <DataList />
  </div>
</template>

<script>
// @ is an alias to /src

import DataList from '../components/DataList'
export default {
  name: 'Home',
  components: { DataList }
}
</script>
