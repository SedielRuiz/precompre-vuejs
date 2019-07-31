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
        class="elevation-1">
        <template v-slot:items="props">
        <td>{{ props.item._type }}</td>
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
    name: 'group-list',
    components: {
      pagination,
    },
    data () {
      return {
        headers: [
            {text:"Tipo", value:"_type"},
            {text:"Estado", value:"status"},
            {text:"Acciones", value:"actons"}
        ]
      }
    },
    mounted () {
      this.fetchGroups()
    },
    methods: {
      ...mapActions({
        fetchGroups: 'group/fetchGroups',
        setWarning: 'setWarning',
      }),
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

