<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md10>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-icon large @click="redirect(true)">keyboard_backspace</v-icon>
            <v-toolbar-title>Detalle permiso</v-toolbar-title>
            <v-spacer></v-spacer>
            <!--v-btn color="success" @click="redirect(false)">Editar</v-btn-->
          </v-toolbar>
          <v-card-text>
            <v-form>
                <v-text-field readonly v-model="permission.title" prepend-icon="title" name="title" label="Titulo" type="text"></v-text-field>
                <v-text-field readonly v-model="permission.code" prepend-icon="code" name="code" label="Código" type="text"></v-text-field>
                <v-text-field readonly v-model="permission.description" prepend-icon="library_books" name="description" label="Descripción" type="text"></v-text-field>
                <v-combobox readonly v-model="permission.status == 'enable' ? 'Activo' : 'Inactivo'" :items="status" prepend-icon="check_circle_outline" label="Estado"></v-combobox>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-dialog v-model="manage" persistent>
          <permissionManage @redirect = "redirect" :edit="true" :id="edit"></permissionManage>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script>
  import {mapActions,mapState} from 'vuex';
  import permissionManage from '@/components/Permissions/permission-manage';
  
  export default {
    name: 'permission-detail',
    components: {
      permissionManage,
    },
    data () {
      return {
        manage:false,
        permission: {},
        status:[
          {text: 'Activo', value:'enabled'},
          {text: 'Inactivo', value:'disabled'},
        ]
      }
    },
    watch:{
      per(val){
          if(val){
              this.permission = val;
          }
      },
    },
    mounted () {
      this.edit = this.$route.params.id;
      this.getPermission(this.edit);
    },
    methods: {
        ...mapActions({
            getPermission: 'permission/getPermission',
            setWarning: 'setWarning',
        }),
        redirect(page){
            if(page){
                this.$router.push('/permissionList')
            }else{
                if(this.manage)
                    this.manage=false;
                else
                    this.manage=true;
            }
        }
    },
    computed:{
        ...mapState({
            warning: state => state.warning,
            per: state => state.permission.permission 
        }),
    },
  }
</script>

