<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm12 md2>
        <h1>Roles</h1>
      </v-flex>
      <v-flex xs12 sm12 md10>
        <v-btn color="success" @click="redirect(false, 0)">Nuevo</v-btn>
        <v-btn color="success"><v-icon medium @click="search({page_size:10})"tooltip="Detalle">refresh</v-icon></v-btn>
      </v-flex>
    </v-layout>
    <hr><br>
    <v-data-table
        :headers="headers"
        :items="rows"
        hide-actions disable-initial-sort
        class="elevation-1">
        <template v-slot:items="props">
          <td>{{ props.item.title }}</td>
          <td>{{ props.item.status == 'enable' ? "Activo" : "Inactivo"}}</td>
          <td><v-icon medium @click="redirect(true, props.item._id)"tooltip="Detalle">more_vert</v-icon></td>
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

