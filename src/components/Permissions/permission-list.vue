<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm12 md2>
        <h1>Permisos</h1>
      </v-flex>
      <v-flex xs12 sm12 md10>
        <!--v-btn color="success" @click="redirect(false, 0)">Nuevo</v-btn-->
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
        <td>{{ props.item.status == 'enable' ? "Activo" : "Inactivo" }}</td>
        <td><v-icon medium @click="redirect(true, props.item._id)"tooltip="Detalle">more_vert</v-icon></td>
        </template>
    </v-data-table>
    <pagination @search="search" :total_pages="total_pages" :total_items="total_items" :page_size="page_size"></pagination>
    <v-dialog v-model="manage" persistent>
        <permissionManage @redirect = "redirect" :edit="false"></permissionManage>
    </v-dialog>
  </v-container>
</template>

<script>
    import {mapActions,mapState} from 'vuex';
    import permissionManage from '@/components/Permissions/permission-manage';
    import pagination from '@/components/Pagination';

  export default {
    name: 'permission-list',
    components: {
      permissionManage,
      pagination,
    },
    data () {
      return {
        manage: false,
        headers: [
            {text:"Titulo", value:"title"},
            {text:"Estado", value:"status"},
            {text:"Acciones", value:"actons"}
        ],
      }
    },
    mounted () {
        this.fetchPermissions();
    },
    methods: {
      ...mapActions({
        fetchPermissions: 'permission/fetchPermissions',
        setWarning: 'setWarning',
      }),
      search(pagination){
        this.fetchPermissions(pagination);
      },
      redirect(page,id){
        if(!page){
            if(this.manage)
                this.manage = false;
            else
                this.manage = true;
        }else{
            this.$router.push('/permissionDetail/'+id)
        }
      }
    },
    computed:{
      ...mapState({
        warning: state => state.warning,
        rows: state => state.permission.permissions,
        page_size: state => state.permission.page_size,
        total_items: state => state.permission.total_items,
        total_pages: state => state.permission.total_pages,
      }),
    },
  }
</script>

