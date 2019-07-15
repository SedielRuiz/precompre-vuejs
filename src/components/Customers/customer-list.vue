<template>
  <v-container>
    <div class="row col-md-10">
        <div class="col-md-8">
            <h1>Clientes</h1>
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
        this.fetchCustomers()
    },
    methods: {
      ...mapActions({
        fetchCustomers: 'customer/fetchCustomers',
        setWarning: 'setWarning',
      }),
      redirect(page,id){
        if(!page){
            this.$router.push('/customerManage')
        }else{
            this.$router.push('/customerDetail/'+id)
        }
      }
    },
    computed:{
      ...mapState({
        warning: state => state.warning,
        rows: state => state.customer.customers
      }),
    },
  }
</script>

