<template>
  <v-card class="elevation-12">
    <v-toolbar dark color="primary">
      <v-toolbar-title>Rutas</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="routes"
        hide-actions disable-initial-sort
        class="elevation-1">
        <template v-slot:items="props">
          <td>{{ props.item.name }}</td>
          <td>
            <span v-for="(hour, index) of props.item.schedule" :key="index"> {{hour}}{{index!==props.item.schedule.length-1?", ":"."}} </span>
          </td>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
  import {mapActions,mapState} from 'vuex';
  
  export default {
    name: 'routes-list',
    data () {
      return {
        category: {},
        titleText:"",
      }
    },
    props:['routes','headers'],
    methods: {
    },
    computed:{
    }
  }
</script>

