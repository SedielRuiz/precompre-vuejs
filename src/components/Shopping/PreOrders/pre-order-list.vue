<template>
  <v-container>
    <v-layout row wrap>
        <v-flex xs12 sm12 md2>
          <h1>Pre ordenes</h1>
        </v-flex>
        <v-flex xs12 sm12 md10>
            <v-btn color="success" @click="redirect()">Nueva pre orden</v-btn>
            <v-btn color="success"><v-icon medium @click="search({page_size:10})"tooltip="Detalle">refresh</v-icon></v-btn>
        </v-flex>
    </v-layout>
    <hr><br>
    <v-data-table
        :headers="headers"
        :items="rows"
        hide-actions disable-initial-sort
        class="elevation-1">
        <template v-slot:items="props">
          <td>{{ props.item.delivery_date ? props.item.delivery_date.split("T")[0] : "" }}</td>
          <td>{{ props.item.delivery_place ? props.item.delivery_place.name : "" }} {{ props.item.delivery_place ? props.item.delivery_place.unit_name : "" }}</td>
          <td>{{ props.item.state }}</td>
          <td><v-btn color="primary" @click="redirect(false, props.item._id)">Detalle</v-btn></td>
        </template>
    </v-data-table>
    <pagination @search="search" :total_pages="total_pages" :total_items="total_items" :page_size="page_size"></pagination>
  </v-container>
</template>

<script>
  import {mapActions,mapState} from 'vuex';
  import pagination from '@/components/Pagination';
  
  export default {
    name: 'pre-orders-list',
    components: {
      pagination,
    },
    data () {
      return {
        headers: [
            {text:"Fecha", value:"delivery_date"},
            {text:"Lugar de estrega", value:"delivery_place"},
            {text:"Estado", value:"state"},
            {text:"Acciones", value:"actons"}
        ]
      }
    },
    mounted () {
        this.fetchPreOrders();
    },
    methods: {
      ...mapActions({
        fetchPreOrders: 'preOrder/fetchPreOrders',
        setWarning: 'setWarning',
      }),
      search(pagination){
        this.fetchPreOrders(pagination);
      },
      redirect(){
        this.$router.push('/preOrder')
      }
    },
    computed:{
      ...mapState({
        warning: state => state.warning,
        rows: state => state.preOrder.preOrders,
        page_size: state => state.preOrder.page_size,
        total_items: state => state.preOrder.total_items,
        total_pages: state => state.preOrder.total_pages,
      }),
    },
  }
</script>

