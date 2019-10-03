<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm12 md2>
        <h1>Insumos</h1>
      </v-flex>
      <v-flex xs12 sm12 md10>
        <v-btn color="success" @click="redirect(false, 0)">Nuevo</v-btn>
        <v-btn color="success"><v-icon medium @click="search({page_size:10})"tooltip="Detalle">refresh</v-icon></v-btn>
      </v-flex>
    </v-layout>
    <hr><br>
    <div v-if="rows" >
      <v-data-table
          :headers="headers"
          :items="rows"
          hide-actions disable-initial-sort
          class="elevation-1">
          <template v-slot:items="props">
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.metric }}</td>
            <td>
              <v-icon medium @click="redirect(true, props.item._id)"tooltip="Detalle">more_vert</v-icon>
              <v-icon style="color:#bf1526;" medium @click="deleteInput(props.item._id)">delete</v-icon>
            </td>
          </template>
      </v-data-table>
    </div>
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
            {text:"Acciones", value:"actions"}
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

