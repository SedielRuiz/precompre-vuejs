<template>
  <div id="app">
    <link href='https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons' rel="stylesheet">
    <h1>{{ msg }}</h1>
    <Menu></Menu>
    <div v-if="processing">
      <BlockUI :message="blockMessage"></BlockUI>
    </div>

    <div v-if="warning">
      <BlockUI :message="warning"></BlockUI>
    </div>
   
    <div v-if="error">
      <BlockUI :message="error"></BlockUI>
    </div>
  </div>
</template>
<script>
import {mapState,mapActions} from 'vuex';
import Menu from '@/components/Menu'
export default {
  name: 'app',
  components: {
    Menu
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      blockMessage: 'Procesando...',
    }
  },
  computed: {
      ...mapState({
        processing: state => state.processing,
        error: state => state.error,
        warning: state => state.warning
      })
    }
}
</script>
