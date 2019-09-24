<template>
  <v-container>
    <div class="row col-md-10">
        <div class="col-md-8">
            <h1>Productos</h1>
        </div>
        <div class="col-md-2">
            <v-btn color="success" @click="redirect(false, 0)">Nuevo</v-btn>
        </div>
    </div>
    <hr><br>
    <v-data-table
        :headers="headers"
        :items="rows"
        hide-actions disable-initial-sort
        class="elevation-1">
        <template v-slot:items="props">
            <td>{{ props.item.name }}</td>
            <td v-if="props.item.product_class">{{ props.item.product_class.code }}</td>
            <td v-else></td>
            <td>{{ props.item.status == 'enable' ? "Activo" : "Inactivo" }}</td>
            <td>
              <v-icon medium @click="redirect(true, props.item._id)"tooltip="Detalle">more_vert</v-icon>
              <v-icon style="color:#bf1526;" medium @click="deleteProduct(props.item._id)">delete</v-icon>
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
    name: 'product-list',
    components: {
      pagination,
    },
    data () {
      return {
        headers: [
            {text:"Nombre", value:"name"},
            {text:"Clase", value:"product_class"},
            {text:"Estado", value:"status"},
            {text:"Acciones", value:"actons"}
        ]
      }
    },
    mounted () {
        this.fetchProducts();
    },
    methods: {
      ...mapActions({
        fetchProducts: 'product/fetchProducts',
        delete: 'product/delete',
        setWarning: 'setWarning',
      }),
      deleteProduct(id){
        if(confirm("¿ Seguro que desea eliminar este registro ? ")){
          this.delete(id).then(
            data => {
              this.setWarning(data, { root: true }).then(()=>{
                  this.fetchProducts();
              })
            },
            error => {
              console.log(error);
            });
        }
      },
      search(pagination){
        this.fetchProducts(pagination);
      },
      redirect(page,id){
        if(!page){
            this.$router.push('/productManage')
        }else{
            this.$router.push('/productDetail/'+id)
        }
      }
    },
    computed:{
      ...mapState({
        warning: state => state.warning,
        rows: state => state.product.products,
        page_size: state => state.product.page_size,
        total_items: state => state.product.total_items,
        total_pages: state => state.product.total_pages,
      }),
    },
  }
</script>

