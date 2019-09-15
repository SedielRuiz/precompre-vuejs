<template>
  <v-container>
    <div class="row col-md-10">
        <div class="col-md-8">
            <h1>Ordenes</h1>
        </div>
        <div class="col-md-2">
            <v-btn color="success" @click="redirect(true)">Volver</v-btn>
        </div>
    </div>
    <hr><br>
    <v-data-table
        :headers="headers"
        :items="rows"
        hide-actions disable-initial-sort
        class="elevation-1">
        <template v-slot:items="props">
          <td>{{ props.item.delivery_date.split("T")[0] }}</td>
          <td>{{ props.item.delivery_place.name }} {{ props.item.delivery_place.unit_name }}</td>
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
    name: 'orders-list',
    components: {
      pagination,
    },
    data () {
      return {
        customer_id:"",
        headers: [
            {text:"Fecha", value:"delivery_date"},
            {text:"Lugar de estrega", value:"delivery_place"},
            {text:"Estado", value:"state"},
            {text:"Acciones", value:"actons"}
        ]
      }
    },
    mounted () {
      this.customer_id = this.$route.params.id == undefined ? 0 : this.$route.params.id;
      this.fetchOrdersCustomer(this.customer_id);
    },
    methods: {
      ...mapActions({
        fetchOrdersCustomer: 'order/fetchOrdersCustomer',
        setWarning: 'setWarning',
      }),
      search(pagination){
        this.fetchOrdersCustomer(pagination);
      },
      redirect(page,id){
        if(page){
          this.$router.push('/customerDetail/'+this.customer_id)
        }else{
          this.$router.push('/orderDetail/'+id)
        }
      }
    },
    computed:{
      ...mapState({
        warning: state => state.warning,
        rows: state => state.order.orders,
        page_size: state => state.order.page_size,
        total_items: state => state.order.total_items,
        total_pages: state => state.order.total_pages,
      }),
    },
  }
</script>

