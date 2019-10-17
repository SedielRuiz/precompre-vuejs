<template>
  <v-container>
    <v-layout row wrap>
        <v-flex xs12 sm12 md2>
          <h1>Pre ordenes</h1>
        </v-flex>
        <v-flex xs12 sm12 md10>
            <v-btn color="success" @click="redirect(true)">Nueva pre orden</v-btn>
            <v-btn color="success"><v-icon medium @click="search({page_size:10})"tooltip="Detalle">refresh</v-icon></v-btn>
        </v-flex>
    </v-layout>
    <hr><br>
    <v-data-table
        :headers="headers"
        :items="preOrders"
        hide-actions disable-initial-sort
        class="elevation-1">
        <template v-slot:items="props">
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.date }}</td>
          <td>{{ props.item.delivery}}</td>
          <td>{{ props.item.customer }}</td>
          <td>
            <v-icon medium @click="redirect(false, props.item.customer_id)">more_vert</v-icon>
            <v-icon style="color:#bf1526;" medium @click="deletePreOrders(props.item)">delete</v-icon>
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
    name: 'pre-orders-list',
    components: {
      pagination,
    },
    data () {
      return {
        headers: [
            {text:"Nombre", value:"name"},
            {text:"Fecha creación", value:"delivery_date"},
            {text:"Lugar de estrega", value:"delivery_place"},
            {text:"Cliente", value:"customer"},
            {text:"Acciones", value:"actons"}
        ],
        preOrders:[],
      }
    },
    watch:{
      rows(val){
        if(val){
          var lst = [];
          var dt = "";
          var d;
          for(var s = 0; s < val.length; s++){
            d = val[s].pre_orders[0].created_at.split("T")[0].split("-");
            dt = d[2]+"/"+d[1]+"/"+d[0];
            lst.push({
              delivery:val[s].pre_orders[0].delivery_place.place_name+" "+val[s].pre_orders[0].delivery_place.cluster_title+" - "+val[s].pre_orders[0].delivery_place.unit_u,
              customer:val[s].pre_orders[0].customer.name +" "+val[s].pre_orders[0].customer.last_name,
              customer_id:val[s].pre_orders[0].customer._id,
              date:dt,
              name:val[s].pre_orders[0].group_name,
              preOrders:val[s],
            });
          }
          this.preOrders = lst;
        }
      }
    },
    mounted () {
        this.fetchPreOrders();
    },
    methods: {
      ...mapActions({
        fetchPreOrders: 'preOrder/fetchPreOrders',
        deletes: 'preOrder/deletes',
        setWarning: 'setWarning',
      }),
      deletePreOrders(obj){
        var preOrdersDelete = [];
        for(var r = 0; r < obj.preOrders.pre_orders.length; r++){
          var x = preOrdersDelete.find(element=>{return element._id == obj.preOrders.pre_orders[r]._id});
          if(x == undefined){
              preOrdersDelete.push({_id:obj.preOrders.pre_orders[r]._id});
          }
        }
        if(confirm("¿Seguro desea eliminar esta pre compra")){
          this.deletes(preOrdersDelete).then(
            data => {
                this.setWarning(data, { root: true }).then(()=>{
                  this.fetchPreOrders();
                })
            },
            error => {
          });
        }
      },
      search(pagination){
        this.fetchPreOrders(pagination);
      },
      redirect(page, id){
        if(!page){
          this.$router.push('/preOrder/'+id)
        }else{
          this.$router.push('/preOrder');
        }
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

