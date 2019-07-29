<template>
  <v-container>
    <div class="row col-md-10">
        <div class="col-md-8">
            <h1>Usuarios</h1>
        </div>
        <div class="col-md-2">
            <v-btn color="success" @click="redirect(false, 0)">Nuevo</v-btn>
        </div>
    </div>
    <hr><br>
    <v-data-table
        :headers="headers"
        :items="rows"
        :pagination.sync="pagination"
        :page-size="page_size"
        :total-items="total_items"
        class="elevation-1">
        <template v-slot:items="props">
          <td>{{ props.item.id_description }}</td>
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.last_name }}</td>
          <td>{{ props.item.email }}</td>
          <td>{{ props.item.status == 'enable' ? "Activo" : "Inactivo" }}</td>
          <td><v-btn color="primary" @click="redirect(true, props.item._id)">Detalle</v-btn></td>
        </template>
    </v-data-table>
  </v-container>
</template>

<script>
  import {mapActions,mapState} from 'vuex';
  
  export default {
    
    name: 'user-list',
    data () {
      return {
        pagination: {
          descending: true,
          page: page_number,
          rowsPerPage: page_size,
          sortBy: 'fat',
          totalItems: total_items,
          rowsPerPageItems: [1, 2, 4, 8, 16]
        },
        headers: [
            {text:"Documento", value:"id_description"},
            {text:"Nombres", value:"name"},
            {text:"Apellidos", value:"last_name"},
            {text:"Correo", value:"email"},
            {text:"Estado", value:"status"},
            {text:"Acciones", value:"actons"}
        ]
      }
    },
    watch:{
      page_size(val){
        console.log(val);
      }
    },
    mounted () {
      this.fetchUsers()
    },
    methods: {
      ...mapActions({
        fetchUsers: 'user/fetchUsers',
        setWarning: 'setWarning',
      }),
      redirect(page,id){
        if(!page){
            this.$router.push('/userManage')
        }else{
            this.$router.push('/userDetail/'+id)
        }
      }
    },
    computed:{
      ...mapState({
        warning: state => state.warning,
        rows: state => state.user.users,
        page_number: state => state.user.page_number,
        page_size: state => state.user.page_size,
        total_items: state => state.user.total_items,
        total_pages: state => state.user.total_pages,
      }),
    },
  }
</script>

