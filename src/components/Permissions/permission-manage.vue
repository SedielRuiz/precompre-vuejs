<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md10>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>{{titleText}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="closeModal()">Cancelar</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form>
                <v-text-field v-model="permission.title" prepend-icon="title" name="title" label="Titulo" type="text"></v-text-field>
                <v-text-field v-if="edit" :disabled="true" v-model="permission.code" prepend-icon="code" name="code" label="Código" type="text"></v-text-field>
                <v-text-field v-model="permission.description" prepend-icon="library_books" name="description" label="Descripción" type="text"></v-text-field>
                <v-combobox v-if="edit" v-model="permission.status == 'enable' ? 'Activo' : 'Inactivo'" :items="status" prepend-icon="check_circle_outline" label="Estado"></v-combobox>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="processPermission()">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import {mapActions,mapState} from 'vuex';
  
  export default {
    name: 'permission-manage',
    data () {
      return {
        permission: {},
        status:[
          {text: 'Activo', value:'enabled'},
          {text: 'Inactivo', value:'disabled'},
        ],
        titleText:""
      }
    },
    props:['edit', 'id'],
    watch:{
      per(val){
          if(val){
              this.permission = val;
          }
      },
    },
    mounted () {
        if(this.edit && this.id){
            this.titleText="Editar permiso"
            this.getPermission(this.id);
        }else{
          this.titleText="Nuevo permiso"
        }
    },
    methods: {
        ...mapActions({
            create: 'permission/create',
            update: 'permission/update',
            getPermission: 'permission/getPermission',
            setWarning: 'setWarning',
        }),
        processPermission() {
            if(this.edit)
                this.permission.status = this.permission.status.value;
            if(this.edit){
                this.update(this.permission).then(
                    data => {
                        this.setWarning(data, { root: true }).then(()=>{
                          this.closeModal();
                          this.$router.push('/permissionDetail/'+this.edit)
                        })
                    },
                    error => {
                })
            }else{
                this.create(this.permission).then(
                    data => {
                        this.setWarning(data, { root: true }).then(()=>{
                          this.closeModal();
                          this.$router.push('/permissionList')
                        })
                    },
                    error => {
                })
            }
        },
        closeModal(){
          this.$emit('redirect', false)
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

