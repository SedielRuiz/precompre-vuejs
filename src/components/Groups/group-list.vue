<template>
  <v-container>
    <div class="row col-md-10">
        <div class="col-md-8">
            <h1>Grupos</h1>
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
        <td>{{ props.item._type }}</td>
        <td>
          <v-icon medium @click="redirect(true, props.item._id)"tooltip="Detalle">more_vert</v-icon>
          <v-icon style="color:#bf1526;" medium @click="deleteGroup(props.item._id)">delete</v-icon>
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
    name: 'group-list',
    components: {
      pagination,
    },
    data () {
      return {
        headers: [
            {text:"Tipo", value:"_type"},
            {text:"Acciones", value:"actons"}
        ]
      }
    },
    mounted () {
      this.fetchGroups();
    },
    methods: {
      ...mapActions({
        fetchGroups: 'group/fetchGroups',
        delete: 'group/delete',
        setWarning: 'setWarning',
      }),
      deleteGroup(id){
        if(confirm("¿ Seguro que desea eliminar este registro ? ")){
          this.delete(id).then(
            data => {
              this.setWarning(data, { root: true }).then(()=>{
                  this.fetchGroups();
              })
            },
            error => {
              console.log(error);
            });
        }
      },
      search(pagination){
        this.fetchGroups(pagination);
      },
      redirect(page,id){
        if(!page){
            this.$router.push('/groupManage')
        }else{
            this.$router.push('/groupDetail/'+id)
        }
      }
    },
    computed:{
      ...mapState({
        warning: state => state.warning,
        rows: state => state.group.groups,
        page_size: state => state.group.page_size,
        total_items: state => state.group.total_items,
        total_pages: state => state.group.total_pages,
      }),
    },
  }
</script>

