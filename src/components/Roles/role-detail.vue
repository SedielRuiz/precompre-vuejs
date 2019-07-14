<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md10>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Detalle rol</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="success" @click="redirect(true)">Editar</v-btn>
            <v-btn color="success" @click="redirect(false)">Volver</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form>
                <v-text-field :disabled="true" v-model="rol.title" prepend-icon="email" name="title" label="Titulo" type="text"></v-text-field>
                <v-combobox :disabled="true" v-model="rol.status == 'enable' ? 'Activo' : 'Inactivo'" :items="status" prepend-icon="email" label="Estado"></v-combobox>
                <h2>Permisos</h2><br>
                <div class="row col-md-8">
                  <v-card style="height: 100%;width: 84%; padding: 31px;">
                    <!--PERMISOS-->
                    <div v-if="permissions">
                      <v-chip v-for="(p, index) in permissions" :key="index">{{p.description}}</v-chip>
                    </div>
                    <!--PERMISOS-->
                  </v-card><br>
                </div>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import {mapActions,mapState, mapGetters} from 'vuex';
  
  export default {
    
    name: 'rol-detail',
    data () {
      return {
        rol: {},
        permissionsId:[],
        status:[
          {text: 'Activo', value:'enabled'},
          {text: 'Inactivo', value:'disabled'},
        ],
        edit:""
      }
    },
    watch:{
        rl(val){
            if(val){
                this.rol = val;
                this.permissionsId = val.permissions;
            }
        }
    },
    mounted () {
        this.edit = this.$route.params.id == undefined ? 0 : this.$route.params.id;
        this.getRol(this.edit);
    },
    methods: {
        ...mapActions({
            getRol: 'role/getRol', 
            setWarning: 'setWarning',
        }),
        redirect(page){
            if(page){
                this.$router.push('/roleManage/'+this.edit)
            }else{
                this.$router.push('/roleList')
            }
        }
    },
    computed:{
        ...mapState({
            warning: state => state.warning,
            rl: state => state.role.role, 
        }),
        ...mapGetters({
            getPermissions: 'permission/getPermissions', 
        }),
        permissions(){
            var permiss = [];
            if(this.permissionsId){
                for(var s in this.permissionsId){
                    if(this.permissionsId[s])
                        permiss.push(this.getPermissions(this.permissionsId[s]));
                }
                return permiss;
            }
        },
    },
  }
</script>

