<template>
  <v-container>
    <v-layout row wrap>
        <v-flex xs12 sm12 md2>
          <h1>Ordenes</h1>
        </v-flex>
        <v-flex xs12 sm12 md1>
          <v-btn color="success" @click="redirect(true)">Nueva</v-btn>
        </v-flex>
    </v-layout>
    <label style="font-size:20px;">Filtros</label><hr>
    <v-layout row wrap>
      <v-flex xs12 sm12 md3>
        <v-select v-model="filter.customer" prepend-icon="account_box" :items="customers" label="Cliente"></v-select>
      </v-flex>
      <v-flex xs12 sm12 md3>
        <v-text-field v-model="filter.date_start" prepend-icon="email" name="email" label="Fecha de inicio" type="date"></v-text-field>
      </v-flex>
      <v-flex xs12 sm12 md3>
        <v-text-field v-model="filter.date_end" prepend-icon="email" name="email" label="Fecha de fin" type="date"></v-text-field>
      </v-flex>
      <v-flex xs12 sm12 md3>
        <v-select v-model="filter.state" prepend-icon="account_box" :items="states" label="Estado"></v-select>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-spacer></v-spacer>
      <v-btn color="success" @click="search(filter)"><v-icon medium>search</v-icon></v-btn>
      <v-btn color="success" @click="clearFilter()"><v-icon medium>delete</v-icon></v-btn>
    </v-layout>
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
          <td>
            <v-icon medium @click="redirect(false, props.item._id)"tooltip="Detalle">more_vert</v-icon>
            <v-icon v-if="props.item.state == 'cart'" style="color:#bf1526;" medium @click="deleteOrder(props.item._id)">delete</v-icon>
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
    name: 'orders-list',
    components: {
      pagination,
    },
    data () {
      return {
        customers:[],
        states:[
          {text:"Carrito", value:"cart"},
          {text:"Pendiente", value:"pending"},
        ],
        filter:{},
        customer_id:"",
        headers: [
            {text:"Fecha", value:"delivery_date"},
            {text:"Lugar de estrega", value:"delivery_place"},
            {text:"Estado", value:"state"},
            {text:"Acciones", value:"actons"}
        ]
      }
    },
    watch:{
      cutms(val){
        if(val){
            for(var s = 0; s < val.length; s++){
                this.customers.push({"text":val[s].name+" "+val[s].last_name, value:val[s]._id});
            }
        }
      },
    },
    mounted () {
      this.fetchCustomers({"page_size":-1});
      this.clearFilter();
    },
    methods: {
      ...mapActions({
        delete: 'order/delete',
        fetchOrders: 'order/fetchOrders',
        fetchCustomers: 'customer/fetchCustomers',
        setWarning: 'setWarning',
      }),
      deleteOrder(id){
        if(confirm("¿ Seguro que desea eliminar este pedido ? ")){
          this.delete(id).then(
            data => {
              this.clearFilter("cart");
            },
            error => {
          });
        }
      },
      clearFilter(state = "", date_start = "", date_end = ""){
        var date = new Date();
        date = date.getFullYear()+"-"+((date.getMonth()+1) < 10 ? "0"+(date.getMonth()+1) : (date.getMonth()+1))+"-"+(date.getDate() < 10 ? "0"+date.getDate(): date.getDate());
        this.filter.date_start = date_start != "" ? date_start : date;
        this.filter.date_end = date_end != "" ? date_end : date;
        this.filter.state = state != "" ? state : "pending";
        this.fetchOrders(this.filter);
        delete this.filter.state;
        
      },
      search(pagination){
        this.fetchOrders(pagination);
      },
      redirect(page,id){
        if(page){
          this.$router.push('/orderManage')
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
        cutms: state => state.customer.customers,
      }),
    },
  }
</script>

