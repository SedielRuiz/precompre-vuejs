<template>
  <v-container>
    <div class="row col-md-10">
        <div class="col-md-8">
            <h1>Clases de producto</h1>
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
    name: 'class-list',
    components: {
      pagination,
    },
    data () {
      return {
        headers: [
            {text:"Nombre", value:"code"},
            {text:"Acciones", value:"actons"}
        ],
      }
    },
    mounted () {
        this.fetchClasss();
    },
    methods: {
      ...mapActions({
        fetchClasss: 'productClass/fetchClasss',
        setWarning: 'setWarning',
      }),
      search(pagination){
        this.fetchClasss(pagination);
      },
      redirect(page,id){
        if(!page){
            this.$router.push('/classProductManage')
        }else{
            this.$router.push('/classProductDetail/'+id)
        }
      }
    },
    computed:{
      ...mapState({
        warning: state => state.warning,
        rows: state => state.productClass.classs,
        page_size: state => state.productClass.page_size,
        total_items: state => state.productClass.total_items,
        total_pages: state => state.productClass.total_pages,
      }),
    },
  }
</script>

