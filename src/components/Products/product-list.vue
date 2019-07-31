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
        class="elevation-1">
        <template v-slot:items="props">
            <td>{{ props.item.name }}</td>
            <td v-if="props.item.product_class">{{ props.item.product_class.code }}</td>
            <td v-else></td>
            <td v-if="props.item.attributes">{{ props.item.attributes[0].value.charAt(0).toUpperCase() + props.item.attributes[0].value.slice(1) }}</td>
            <td v-else></td>
            <td>{{ props.item.status == 'enable' ? "Activo" : "Inactivo" }}</td>
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
    name: 'product-list',
    components: {
      pagination,
    },
    data () {
      return {
        headers: [
            {text:"Nombre", value:"name"},
            {text:"Clases", value:"product_class"},
            {text:"Atributos", value:"attributes"},
            {text:"Estado", value:"status"},
            {text:"Acciones", value:"actons"}
        ]
      }
    },
    mounted () {
        this.fetchProducts()
    },
    methods: {
      ...mapActions({
        fetchProducts: 'product/fetchProducts',
        setWarning: 'setWarning',
      }),
      search(pagination){
        this.fetchRoles(pagination);
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

