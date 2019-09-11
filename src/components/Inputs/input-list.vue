<template>
  <v-container>
    <div class="row col-md-10">
        <div class="col-md-8">
            <h1>Insumos</h1>
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
          <td>{{ props.item.metric }}</td>
          <td>
            <v-btn color="primary" @click="redirect(true, props.item._id)">Editar</v-btn>
            <v-btn color="error" @click="deleteInput(props.item._id)">Eliminar</v-btn>
          </td>
        </template>
    </v-data-table>
    <pagination @search="search" :total_pages="total_pages" :total_items="total_items" :page_size="page_size"></pagination>
    <v-dialog v-model="create" persistent>
        <inputManage @redirect = "redirect" :edit="false"></inputManage>
    </v-dialog>
    <v-dialog v-if="edit && update" v-model="update" persistent>
        <inputManage @redirect = "redirect" :id="edit" :edit="true"></inputManage>
    </v-dialog>
  </v-container>
</template>

<script>
    import {mapActions,mapState} from 'vuex';
    import inputManage from '@/components/Inputs/input-manage';
    import pagination from '@/components/Pagination';

  export default {
    name: 'input-list',
    components: {
      inputManage,
      pagination,
    },
    data () {
      return {
        edit:"",
        create:false,
        update:false,
        headers: [
            {text:"Nombre", value:"name"},
            {text:"Unidad de medida", value:"metric"},
            {text:"Acciones", value:"actons"}
        ],
      }
    },
    mounted () {
        this.fetchInputs();
    },
    methods: {
      ...mapActions({
        fetchInputs: 'input/fetchInputs',
        delete: 'input/delete',
        setWarning: 'setWarning',
      }),
      deleteInput(id){
        if(confirm("¿ Seguro que desea eliminar este registro ? ")){
          this.delete(id).then(
            data => {
              this.setWarning(data, { root: true }).then(()=>{
                  this.fetchInputs();
              })
            },
            error => {
              console.log(error);
            });
        }
      },
      search(pagination){
        this.fetchInputs(pagination);
      },
      redirect(page,id){
        if(page == "close"){
            this.update = false;
            this.create = false;
            this.fetchInputs();
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
        rows: state => state.input.inputs,
        page_size: state => state.input.page_size,
        total_items: state => state.input.total_items,
        total_pages: state => state.input.total_pages,
      }),
    },
  }
</script>

