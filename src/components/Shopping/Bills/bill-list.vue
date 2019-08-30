<template>
  <v-container>
    <div class="row col-md-10">
        <div class="col-md-8">
            <h1>Facturas</h1>
        </div>
        <div class="col-md-2">
            <v-btn color="success" @click="redirect(true)">Volver</v-btn>
        </div>
    </div>
    <hr><br>
    <v-data-table
        :headers="headers"
        :items="rows"
        class="elevation-1">
        <template v-slot:items="props">
        <td>{{ props.item._id }}</td>
        <td>{{ props.item.delivery_place }}</td>
        <td>{{ props.item.status }}</td>
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
    name: 'bill-list',
    components: {
      pagination,
    },
    data () {
      return {
        customer_id:"",
        headers: [
            {text:"Código", value:"_id"},
            {text:"Lugar de estrega", value:"delivery_place"},
            {text:"Estado", value:"status"},
            {text:"Acciones", value:"actons"}
        ]
      }
    },
    mounted () {
      this.customer_id = this.$route.params.id == undefined ? 0 : this.$route.params.id;
      this.fetchBills(this.customer_id);
    },
    methods: {
      ...mapActions({
        fetchBills: 'order/fetchBills',
        setWarning: 'setWarning',
      }),
      search(pagination){
        this.fetchBills(pagination);
      },
      redirect(page,id){
        if(page){
          this.$router.push('/customerDetail/'+this.customer_id)
        }else{
          this.$router.push('/customerList')
        }
      }
    },
    computed:{
      ...mapState({
        warning: state => state.warning,
        rows: state => state.order.bills,
        page_size: state => state.order.page_size,
        total_items: state => state.order.total_items,
        total_pages: state => state.order.total_pages,
      }),
    },
  }
</script>

