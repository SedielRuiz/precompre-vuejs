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
        <td><v-btn color="primary" @click="redirect(true, props.item._id)">Editar</v-btn></td>
        </template>
    </v-data-table>
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

  export default {
    name: 'category-list',
    components: {
      categoryManage,
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
        setWarning: 'setWarning',
      }),
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
        rows: state => state.category.categories
      }),
    },
  }
</script>

