<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md10>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>{{titleText}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn v-if="edit != 0" color="error" @click="redirect(true)">Cancelar</v-btn>
            <v-btn v-if="edit == 0" color="error" @click="redirect(false)">Cancelar</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form>
                <v-text-field v-model="rol.title" prepend-icon="title" name="title" label="Titulo" type="text"></v-text-field>
                <v-combobox v-if="edit" v-model="rol.status == 'enable' ? 'Activo' : 'Inactivo'" :items="status" prepend-icon="check_circle_outline" label="Estado"></v-combobox>
                <h2>Permisos</h2><br>
                <div class="row col-md-8">
                  <v-card style="height: 100%;width: 84%; padding: 31px;">
                    <!--PERMISOS-->
                    <v-data-table v-model="permissions" :headers="headers" :items="rows" :pagination.sync="pagination" select-all item-key="title" class="elevation-1">
                        <template v-slot:headers="props">
                            <tr>
                                <th>
                                    <v-checkbox :input-value="props.all" :indeterminate="props.indeterminate" primary hide-details  @click.stop="removePermission"></v-checkbox>
                                </th>
                                <th v-for="header in props.headers" :key="header.text" :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']" @click="changeSort(header.value)">
                                    <v-icon small>arrow_upward</v-icon>
                                    {{ header.text }}
                                </th>
                            </tr>
                        </template>
                        <template v-slot:items="props">
                            <tr :active="props.selected" @click="props.selected = !props.selected">
                                <td>
                                    <v-checkbox :input-value="props.selected" primary hide-details></v-checkbox>
                                </td>
                                <td>{{ props.item.title }}</td>
                                <td class="text-xs-right">{{ props.item.code }}</td>
                                <td class="text-xs-right">{{ props.item.description }}</td>
                                <td class="text-xs-right">{{ props.item.status }}</td>
                            </tr>
                        </template>
                    </v-data-table>
                    <!--PERMISOS-->
                  </v-card><br>
                </div>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="processRol()">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import {mapActions,mapState, mapGetters} from 'vuex';
  
  export default {
    
    name: 'rol-manage',
    data () {
      return {
        pagination: {
            sortBy: 'name'
        },
        headers: [
            {text:"Titulo", value:"title"},
            {text:"Código", value:"code"},
            {text:"Descripción", value:"description"},
            {text:"Estado", value:"status"}
        ],
        rol: {},
        permissions:[],
        status:[
          {text: 'Activo', value:'enabled'},
          {text: 'Inactivo', value:'disabled'},
        ],
        edit:"",
        titleText:""
      }
    },
    watch:{
        rl(val){
            if(val){
                this.rol = val;
                this.permissions = val.permissions;
            }
        },
    },
    mounted () {
        this.fetchPermissions({"page_size":-1});
        this.edit = this.$route.params.id == undefined ? 0 : this.$route.params.id;
        if(this.edit!=""){
            this.titleText="Editar rol"
            this.getRol(this.edit);
        }else{
          this.titleText="Nuevo rol"
        }
    },
    methods: {
        ...mapActions({
            create: 'role/create',
            update: 'role/update',
            getRol: 'role/getRol', 
            fetchPermissions: 'permission/fetchPermissions',
            setWarning: 'setWarning',
        }),
        removePermission () {
            if (this.permissions.length) this.permissions = []
            else this.permissions = this.rows.slice()
        },
        changeSort (column) {
            if (this.pagination.sortBy === column) {
            this.pagination.descending = !this.pagination.descending
            } else {
            this.pagination.sortBy = column
            this.pagination.descending = false
            }
        },
        buildRol(){
            console.log(this.permissions);
            var per = [];
            for(var s = 0; s < this.permissions.length; s++){
                per.push(this.permissions[s]._id);
            }
            this.rol.permissions = per;
            if(this.edit)
                this.rol.status = this.rol.status.value;
            return this.rol;
        },
        processRol () {
            this.rol = this.buildRol();
            if(this.edit){
                this.update(this.rol).then(
                    data => {
                        this.setWarning(data, { root: true }).then(()=>{
                            this.$router.push('/roleDetail/'+this.edit)
                        })
                    },
                    error => {
                })
            }else{
                this.create(this.rol).then(
                    data => {
                        this.setWarning(data, { root: true }).then(()=>{
                            this.$router.push('/roleList')
                        })
                    },
                    error => {
                })
            }
        },
        redirect(page){
            if(page){
                this.$router.push('/roleDetail/'+this.edit)
            }else{
                this.$router.push('/roleList')
            }
        }
    },
    computed:{
        ...mapState({
            warning: state => state.warning,
            rl: state => state.role.role, 
            rows: state => state.permission.permissions, 
        }),
    },
  }
</script>

