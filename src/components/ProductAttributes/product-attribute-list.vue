<template>
  <v-container>
    <div class="row col-md-10">
        <div class="col-md-8">
            <h1>Atributos de producto</h1>
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
        <td>{{ props.item.code }}</td>
        <td>{{ props.item.type }}</td>
        <td>{{ props.item.required ? 'Si' : 'No'}}</td>
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
    name: 'attribute-list',
    components: {
      pagination,
    },
    data () {
      return {
        headers: [
            {text:"Nombre", value:"code"},
            {text:"Tipo", value:"type"},
            {text:"Requerido", value:"required"},
            {text:"Acciones", value:"actons"}
        ],
      }
    },
    mounted () {
        this.fetchAttributes();
    },
    methods: {
      ...mapActions({
        fetchAttributes: 'productAttribute/fetchAttributes',
        setWarning: 'setWarning',
      }),
      search(pagination){
        this.fetchAttributes(pagination);
      },
      redirect(page,id){
        if(!page){
            this.$router.push('/atributesProductManage')
        }else{
            this.$router.push('/atributesProductDetail/'+id)
        }
      }
    },
    computed:{
      ...mapState({
        warning: state => state.warning,
        rows: state => state.productAttribute.attributes,
        page_size: state => state.productAttribute.page_size,
        total_items: state => state.productAttribute.total_items,
        total_pages: state => state.productAttribute.total_pages,
      }),
    },
  }
</script>

