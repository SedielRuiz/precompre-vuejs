<template>
  <v-container>
    <v-layout row wrap>
        <v-flex xs12 sm12 md2>
          <h1>Ordenes</h1>
        </v-flex>
        <v-flex xs12 sm12 md4>
          <v-btn color="success" @click="redirect(true)">Nueva</v-btn>
          <v-btn color="success"><v-icon medium @click="search({page_size:-1})"tooltip="Detalle">refresh</v-icon></v-btn>
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
          <td> 
            <p>
              <span style="display: inline-block">{{ props.item.created_at.substring(0,10) }}</span>
              <br>
              {{ props.item.created_at.substring(11,16) }} <br> {{getHour(props.item.created_at)}}
            </p>
          </td>
          <td> 
            <p>
              {{ props.item.delivery_date.substring(0,10) }}
              <br>
              {{ props.item.delivery_date.substring(11,16) }}
            </p>
          </td>
          <td>{{ props.item.delivery_place ? props.item.delivery_place.place_name : "" }}</td>
          <td>{{ props.item.item.product ? props.item.item.product.name : "" }}</td>
          <td>
             <div v-for="(attr, attr_index) in props.item.item.attributes[0]" :key="attr_index+1" v-if="props.item.item.hasOwnProperty('pivot')">
              <div v-for="(att, att_index) in attrs" :key="`att_index${att_index}`">
                <div v-if="attr.attribute == att._id">
                  <label style="font-size: 12px;">
                    <div v-if="attr.value && att.visible && att.code != 'photo'">
                      {{att.code.charAt(0).toUpperCase() + att.code.slice(1)}}: {{attr.value.charAt(0).toUpperCase() + attr.value.slice(1)}}
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </td>
          <td>
          {{ props.item.customer ? props.item.customer.name : ""}} {{props.item.customer ? props.item.customer.last_name :""}} </td> 
          <td>{{ getState(props.item.state) }}</td>
          <td>
            <v-icon medium @click="redirect(false, props.item._id)"tooltip="Detalle">more_vert</v-icon>
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
        orders:[],
        customers:[],
        states:[
          {text:"Carrito", value:"cart"},
          {text:"Pendiente", value:"pending"},
        ],
        filter:{},
        customer_id:"",
        headers: [
            {text:"Fecha creación", value:"delivery_date"},
            {text:"Fecha entrega", value:"delivery_date"},
            {text:"Lugar de entrega", value:"delivery_place"},
            {text:"Producto", value:"product"},
            {text:"Atributos", value:"attributes"},
            {text:"Cliente", value:"customer"},
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
      rows(val){
        if(false){
          for(var s = 0; s < val.length; s++){
            for(var r = 0; r < val[s].orders.length; r++){
              this.orders.push({
                delivery_date:val[s].orders[r].delivery_date,
                delivery_place:val[s].orders[r].delivery_place,
                state:val[s].orders[r].state,
                _id:val[s].orders[r]._id
              });
              /*for(var j = 0; j < val[s].orders[r].items.length; j++){
              }*/
            }
          }
        }
      },
    },
    mounted () {
      this.fetchAttributes({page_size:-1});
      var date = new Date();
      date = date.getFullYear()+"-"+((date.getMonth()+1) < 10 ? "0"+(date.getMonth()+1) : (date.getMonth()+1))+"-"+(date.getDate() < 10 ? "0"+date.getDate(): date.getDate());
      this.filter.date_start = date;
      this.filter.date_end = date;
      this.fetchCustomers({"page_size":-1});
      this.rows = [];
    },
    methods: {
      ...mapActions({
        delete: 'order/delete',
        fetchOrders: 'order/fetchOrders',
        fetchCustomers: 'customer/fetchCustomers',
        setWarning: 'setWarning',
        fetchAttributes: 'productAttribute/fetchAttributes',
      }),
      getHour(date){
        var dt = new Date(date);
        return (dt.getHours() < 10 ? "0"+dt.getHours() : dt.getHours())+":"+(dt.getMinutes() < 10 ? "0"+dt.getMinutes() : dt.getMinutes())+":"+(dt.getSeconds() < 10 ? "0"+dt.getSeconds() :dt.getSeconds());
      },
      getState(state){
        var name = "";
        switch(state){
          case "cart":name="Carrito";break;
          case "pending":name="Pendiente";break;
        }
        return name;
      },
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
        attrs: state => state.productAttribute.attributes,
      }),
    },
  }
</script>

