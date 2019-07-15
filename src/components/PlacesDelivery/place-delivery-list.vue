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
  </v-container>
</template>

<script>
  import {mapActions,mapState} from 'vuex';
  
  export default {
    
    name: 'place-delivery-list',
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
        rows: state => state.placeDelivery.places
      }),
    },
  }
</script>

