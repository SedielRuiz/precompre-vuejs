<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md10>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>{{titleText}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn v-if="edit != ''" color="error" @click="redirect(true)">Cancelar</v-btn>
            <v-btn v-if="edit == 0" color="error" @click="redirect(false)">Cancelar</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form>
                <v-combobox v-model="group._type" prepend-icon="email" :items="types" label="Tipo"></v-combobox>
                <h2>Clientes</h2><br>
                <div class="row col-md-8">
                  <v-card style="height: 100%;width: 84%; padding: 31px;">
                    <!--CLIENTES-->
                    <v-data-table v-model="customers" :headers="headers" :items="rows" :pagination.sync="pagination" select-all item-key="_id" class="elevation-1">
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
                                <td class="text-xs-right">{{ props.item.name }}</td>
                                <td class="text-xs-right">{{ props.item.last_name }}</td>
                                <td class="text-xs-right">{{ props.item.email }}</td>
                                <td class="text-xs-right">{{ props.item.status }}</td>
                            </tr>
                        </template>
                    </v-data-table>
                    <!--CLIENTES-->
                  </v-card><br>
                </div>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="processGroup()">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import {mapActions,mapState} from 'vuex';
  
  export default {
    
    name: 'group-manage',
    data () {
      return {
        group: {},
        customers:[],
        customersId:[],
        pagination: {
            sortBy: 'name'
        },
        headers: [
            {text:"Nombre", value:"name"},
            {text:"Apellido", value:"last_name"},
            {text:"Correo", value:"email"},
            {text:"Estado", value:"status"}
        ],
        types:[
            {text:"Empresa", value:"company"},
            {text:"Familia", value:"family"}
        ],
        edit:"",
        titleText:""
      }
    },
    watch:{
        grp(val){
          if(val){
            this.group = val;
            this.group._type = this.types.find(element=>{return element.value == val._type });
            this.customers = val.community;
            if(this.edit){
                for(var s = 0; s < this.customersId.length; s++){
                    for(var r = 0; r < this.rows.length; r++){
                        if(this.customersId[s] == this.rows[r]._id){
                            this.customers.push(this.rows[s]);
                        }
                    }
                }
            }
          }
        },
    },
    mounted () {
        this.fetchCustomers();
        this.edit = this.$route.params.id == undefined ? 0 : this.$route.params.id;
        if(this.edit!=""){
            this.titleText="Editar grupo";
            this.getGroup(this.edit);
        }else{
          this.titleText="Nuevo grupo";
        }
    },
    methods: {
        ...mapActions({
            create: 'group/create',
            update: 'group/update',
            getGroup: 'group/getGroup', 
            fetchCustomers: 'customer/fetchCustomers',
            setWarning: 'setWarning',
        }),
        buildCustomers(){
            var custom = [];
            for(var s = 0; s < this.customers.length; s++){
                custom.push(this.customers[s]._id);
            }
            return custom;
        },
        buildGroup(){
            this.group._type = this.group._type && this.group._type.value ? this.group._type.value : this.group._type;
            this.group.community = this.buildCustomers();
            return this.group;
        },
        processGroup () {
            this.group = this.buildGroup();
            if(this.edit){
                this.update(this.group).then(
                    data => {
                        this.setWarning(data.message, { root: true }).then(()=>{
                            this.$router.push('/groupDetail/'+this.edit)
                        })
                    },
                    error => {
                })
            }else{
                this.create(this.group).then(
                    data => {
                        this.setWarning(data.message, { root: true }).then(()=>{
                            this.$router.push('/groupList')
                        })
                    },
                    error => {
                })
            }
        },
        redirect(page){
            if(page){
                this.$router.push('/groupDetail/'+this.edit)
            }else{
                this.$router.push('/groupList')
            }
        }
    },
    computed:{
        ...mapState({
            warning: state => state.warning,
            grp: state => state.group.group, 
            rows: state => state.customer.customers, 
        }),
    },
  }
</script>

