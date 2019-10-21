<template>
  <v-card class="elevation-12">
    <v-toolbar dark color="primary">
      <v-toolbar-title>Atributos</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="attributes"
        hide-actions disable-initial-sort
        class="elevation-1">
        <template v-slot:items="props">
          <td>{{ props.item.info ? props.item.info.code : ""}}</td>
          <td>{{ props.item[headers[1].value] ? 'Si' : 'No' }}</td>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
  import {mapActions,mapState} from 'vuex';
  
  export default {
    name: 'options-list',
    data () {
      return {
        category: {},
        titleText:"",
      }
    },
    props:['attributes','headers'],
    methods: {
    },
    computed:{
    }
  }
</script>

