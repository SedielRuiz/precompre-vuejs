<template>
  <v-container>
    <div class="row col-md-10">
        <div class="col-md-8">
            <h1>Categorias</h1>
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
          <td>{{ props.item.name }}</td>
          <td>
            <v-btn color="primary" @click="redirect(true, props.item._id)">Editar</v-btn>
            <v-btn color="error" @click="deleteCategory(props.item._id)">Eliminar</v-btn>
          </td>
        </template>
    </v-data-table>
    <pagination @search="search" :total_pages="total_pages" :total_items="total_items" :page_size="page_size"></pagination>
    <v-dialog v-if="create" v-model="create" persistent>
        <categoryManage @redirect = "redirect" :edit="false"></categoryManage>
    </v-dialog>
    <v-dialog v-if="edit && update" v-model="update" persistent>
        <categoryManage @redirect = "redirect" :id="edit" :edit="true"></categoryManage>
    </v-dialog>
  </v-container>
</template>

<script>
    import {mapActions,mapState} from 'vuex';
    import categoryManage from '@/components/Categories/category-manage';
    import pagination from '@/components/Pagination';

  export default {
    name: 'category-list',
    components: {
      categoryManage,
      pagination,
    },
    data () {
      return {
        edit:"",
        create:false,
        update:false,
        headers: [
            {text:"Titulo", value:"title"},
            {text:"Nombre", value:"name"},
            {text:"Acciones", value:"actions"}
        ],
      }
    },
    mounted () {
        this.fetchCategories();
    },
    methods: {
      ...mapActions({
        fetchCategories: 'category/fetchCategories',
        delete: 'category/delete',
        setWarning: 'setWarning',
      }),
      deleteCategory(id){
        if(confirm("¿ Seguro que desea eliminar este registro ? ")){
          this.delete(id).then(
            data => {
              this.setWarning(data, { root: true }).then(()=>{
                  this.fetchCategories();
              })
            },
            error => {
              console.log(error);
            });
        }
      },
      search(pagination){
        this.fetchCategories(pagination);
      },
      redirect(page,id){
        if(page == "close"){
            this.update = false;
            this.create = false;
            this.fetchCategories();
        }else{
            if(page){
                this.edit = id;
                this.create = false;
                this.update = true;
            }else{
                this.update = false;
                this.create = true;
            }
        }   
      }
    },
    computed:{
      ...mapState({
        warning: state => state.warning,
        rows: state => state.category.categories,
        page_size: state => state.category.page_size,
        total_items: state => state.category.total_items,
        total_pages: state => state.category.total_pages,
      }),
    },
  }
</script>

