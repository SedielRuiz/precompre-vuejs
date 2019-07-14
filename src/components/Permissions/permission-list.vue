<template>
  <v-container>
    <div class="row col-md-10">
        <div class="col-md-8">
            <h1>Permisos</h1>
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
        <td>{{ props.item.code }}</td>
        <td>{{ props.item.description }}</td>
        <td>{{ props.item.status == 'enable' ? "Activo" : "Inactivo" }}</td>
        <td><v-btn color="primary" @click="redirect(true, props.item._id)">Detalle</v-btn></td>
        </template>
    </v-data-table>
    <v-dialog v-model="manage" persistent>
        <permissionManage @redirect = "redirect" :edit="false"></permissionManage>
    </v-dialog>
  </v-container>
</template>

<script>
    import {mapActions,mapState} from 'vuex';
    import permissionManage from '@/components/Permissions/permission-manage';

  export default {
    name: 'permission-list',
    components: {
      permissionManage,
    },
    data () {
      return {
        manage: false,
        headers: [
            {text:"Titulo", value:"title"},
            {text:"Código", value:"code"},
            {text:"Descripción", value:"description"},
            {text:"Estado", value:"status"},
            {text:"Acciones", value:"actons"}
        ],
        /*rows:[
            {title:"uno", code:"ssrp123", description:"Es este we", status:"Activo"},
        ]*/
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
        rows: state => state.permission.permissions
      }),
    },
  }
</script>

