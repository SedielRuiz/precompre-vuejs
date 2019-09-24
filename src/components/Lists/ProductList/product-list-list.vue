<template>
  <v-container>
    <div class="row col-md-10">
        <div class="col-md-8">
            <h1>Filtros de productos</h1>
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
        <td>{{ props.item.title }}</td>
        <td>
          <v-icon medium @click="redirect(true, props.item._id)"tooltip="Detalle">more_vert</v-icon>
          <v-icon style="color:#bf1526;" medium @click="deleteList(props.item._id)">delete</v-icon>
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
    name: 'product-list-list',
    components: {
      pagination,
    },
    data () {
      return {
        headers: [
            {text:"Nombres", value:"title"},
            {text:"Acciones", value:"actons"}
        ]
      }
    },
    mounted () {
      this.fetchProductLists();
    },
    methods: {
      ...mapActions({
        fetchProductLists: 'productList/fetchProductLists',
        delete: 'productList/delete',
        setWarning: 'setWarning',
      }),
      deleteList(id){
        if(confirm("¿ Seguro que desea eliminar este registro ? ")){
          this.delete(id).then(
            data => {
              this.setWarning(data, { root: true }).then(()=>{
                  this.fetchProductLists();
              })
            },
            error => {
              console.log(error);
            });
        }
      },
      search(pagination){
        this.fetchProductLists(pagination);
      },
      redirect(page,id){
        if(!page){
            this.$router.push('/productListManage')
        }else{
            this.$router.push('/productListDetail/'+id)
        }
      }
    },
    computed:{
      ...mapState({
        warning: state => state.warning,
        rows: state => state.productList.productLists,
        page_size: state => state.productList.page_size,
        total_items: state => state.productList.total_items,
        total_pages: state => state.productList.total_pages,
      }),
    },
  }
</script>

