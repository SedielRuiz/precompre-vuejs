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
        class="elevation-1">
        <template v-slot:items="props">
        <td>{{ props.item.id_description }}</td>
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.last_name }}</td>
        <td>{{ props.item.email }}</td>
        <td>{{ props.item.status }}</td>
        <td><v-btn color="primary" @click="redirect(true, props.item._id)">Detalle</v-btn></td>
        </template>
    </v-data-table>
  </v-container>
</template>

<script>
  import {mapActions,mapGetters,mapState} from 'vuex';
  
  export default {
    
    name: 'user-list',
    data () {
      return {
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
        rows: state => state.user.users
      }),
    },
  }
</script>

