<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm12 md4>
          <h1>Lugares de entrega</h1>
      </v-flex>
      <v-flex xs12 sm12 md8>
          <v-btn color="success" @click="redirect(false, 0)">Nuevo</v-btn>
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
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.address }}</td>
            <td>{{ props.item.city }}</td>
            <td>{{ props.item.welcome_code }}</td>
            <td>
              <v-icon medium @click="redirect(true, props.item._id)"tooltip="Detalle">more_vert</v-icon>
              <v-icon style="color:#bf1526;" medium @click="deletePlace(props.item._id)">delete</v-icon>
            </td>
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
            {text:"Código de bienvenida", value:"welcome_code"},
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
        delete: 'placeDelivery/delete',
        setWarning: 'setWarning',
      }),
      deletePlace(id){
        if(confirm("¿ Seguro que desea eliminar este registro ? ")){
          this.delete(id).then(
            data => {
              this.setWarning(data, { root: true }).then(()=>{
                  this.fetchPlaceDelivery();
              })
            },
            error => {
              console.log(error);
            });
        }
      },
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

