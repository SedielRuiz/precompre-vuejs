<template>
  <v-container>
    <div class="row col-md-10">
        <div class="col-md-8">
            <h1>Lugares de entrega</h1>
        </div>
        <div class="col-md-2">
            <v-btn color="success" @click="redirect(false, 0)">Nuevo</v-btn>
        </div>
    </div>
    <hr><br>
    <v-data-table
        :headers="headers"
        :items="rows"
        class="elevation-1">
        <template v-slot:items="props">
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.address }}</td>
            <td>{{ props.item.city }}</td>
            <td><v-btn color="primary" @click="redirect(true, props.item._id)">Detalle</v-btn></td>
        </template>
    </v-data-table>
    <pagination @search="search" :total_pages="total_pages" :total_items="total_items" :page_size="page_size"></pagination>
  </v-container>
</template>

<script>
  import {mapActions,mapState} from 'vuex';
  import pagination from '@/components/Pagination';
  
  export default {
    name: 'place-delivery-list',
    components: {
      pagination,
    },
    data () {
      return {
        headers: [
            {text:"Nombre", value:"name"},
            {text:"Dirección", value:"address"},
            {text:"Ciudad", value:"city"},
            {text:"Acciones", value:"actions"}
        ]
      }
    },
    mounted () {
        this.fetchPlaceDelivery();
    },
    methods: {
      ...mapActions({
        fetchPlaceDelivery: 'placeDelivery/fetchPlaces',
        setWarning: 'setWarning',
      }),
      search(pagination){
        this.fetchPlaceDelivery(pagination);
      },
      redirect(page,id){
        if(!page){
            this.$router.push('/placeDeliveryManage')
        }else{
            this.$router.push('/placeDeliveryDetail/'+id)
        }
      }
    },
    computed:{
      ...mapState({
        warning: state => state.warning,
        rows: state => state.placeDelivery.places,
        page_size: state => state.placeDelivery.page_size,
        total_items: state => state.placeDelivery.total_items,
        total_pages: state => state.placeDelivery.total_pages,
      }),
    },
  }
</script>

