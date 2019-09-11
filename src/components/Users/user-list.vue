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
        :total-items="total_items"
        class="elevation-1">
        <template v-slot:items="props">
          <td>{{ props.item.id_description }}</td>
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.last_name }}</td>
          <td>{{ props.item.email }}</td>
          <td>{{ props.item.status == 'enable' ? "Activo" : "Inactivo" }}</td>
          <td>
            <v-btn color="primary" @click="redirect(true, props.item._id)">Detalle</v-btn>
            <v-btn color="error" @click="deleteUser(props.item._id)">Eliminar</v-btn>
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
    name: 'user-list',
    components:{
      pagination,
    },
    data () {
      return {
        headers: [
            {text:"Documento", value:"id_description"},
            {text:"Nombres", value:"name"},
            {text:"Apellidos", value:"last_name"},
            {text:"Correo", value:"email"},
            {text:"Estado", value:"status"},
            {text:"Acciones", value:"actons"}
        ],
      }
    },
    mounted () {
      this.fetchUsers();
    },
    methods: {
      ...mapActions({
        fetchUsers: 'user/fetchUsers',
        delete: 'user/delete',
        setWarning: 'setWarning',
      }),
      deleteUser(id){
        this.delete(id).then(
          data => {
            this.setWarning(data, { root: true }).then(()=>{
                this.fetchUsers();
            })
          },
          error => {
            console.log(error);
          });
      },
      search(pagination){
        this.fetchUsers(pagination);
      },
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
        page_size: state => state.user.page_size,
        total_items: state => state.user.total_items,
        total_pages: state => state.user.total_pages,
      }),
    },
  }
</script>

