<template>
  <v-container>
    <div class="row col-md-10">
        <div class="col-md-8">
            <h1>Roles</h1>
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
        <td>{{ props.item.status == 'enable' ? "Activo" : "Inactivo"}}</td>
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
    name: 'role-list',
    components: {
      pagination,
    },
    data () {
      return {
        headers: [
            {text:"Titulo", value:"title"},
            {text:"Estado", value:"status"},
            {text:"Acciones", value:"actons"}
        ],
      }
    },
    mounted () {
      this.fetchRoles();
    },
    methods: {
      ...mapActions({
        fetchRoles: 'role/fetchRoles',
        setWarning: 'setWarning',
      }),
      search(pagination){
        this.fetchRoles(pagination);
      },
      redirect(page,id){
        if(!page){
            this.$router.push('/roleManage')
        }else{
            this.$router.push('/roleDetail/'+id)
        }
      }
    },
    computed:{
      ...mapState({
        warning: state => state.warning,
        rows: state => state.role.roles,
        page_size: state => state.role.page_size,
        total_items: state => state.role.total_items,
        total_pages: state => state.role.total_pages,
      }),
    },
  }
</script>

