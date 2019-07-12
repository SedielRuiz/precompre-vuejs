<template>
    <div>
        <h1>Bienvenido</h1>
    </div>
</template>

<script>

  import {mapState, mapGetters, mapActions} from 'vuex';

  export default {
    name: 'Welcome',
    data: () => ({
      drawer: null
    }),
    props: {
      //source: String
    },
    methods:{

    },
  }
</script>