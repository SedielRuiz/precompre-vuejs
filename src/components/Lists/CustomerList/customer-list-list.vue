<template>
  <v-container>
    <div class="row col-md-10">
        <div class="col-md-8">
            <h1>Listas de clientes</h1>
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
    name: 'customer-list-list',
    components: {
      pagination,
    },
    data () {
      return {
        headers: [
            {text:"Nombres", value:"name"},
            {text:"Acciones", value:"actons"}
        ]
      }
    },
    mounted () {
      this.fetchCustomerLists();
    },
    methods: {
      ...mapActions({
        fetchCustomerLists: 'productList/fetchCustomerLists',
        setWarning: 'setWarning',
      }),
      search(pagination){
        this.fetchCustomerLists(pagination);
      },
      redirect(page,id){
        if(!page){
            this.$router.push('/customerListManage')
        }else{
            this.$router.push('/customerListDetail/'+id)
        }
      }
    },
    computed:{
      ...mapState({
        warning: state => state.warning,
        rows: state => state.customerList.customerLists,
        page_size: state => state.customerList.page_size,
        total_items: state => state.customerList.total_items,
        total_pages: state => state.customerList.total_pages,
      }),
    },
  }
</script>

