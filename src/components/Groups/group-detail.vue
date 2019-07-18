<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md10>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Detalle de grupo</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="success" @click="redirect(true)">Editar</v-btn>
            <v-btn color="error" @click="redirect(false)">Cancelar</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form>
                <v-text-field :disabled="true" v-model="group._type" prepend-icon="email" name="name" label="Tipo" type="text"></v-text-field>
                <h2>Clientes</h2><hr><br>
                <div v-if="customers">
                    <v-chip v-for="(c, index) in customers" :key="index" class="custom" >{{c.id_type.toUpperCase()}} {{c.id_description}} - {{c.name}} {{c.last_name}}</v-chip>
                  <!--div v-for="(c, index) in customers">
                  </div--><br>
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
<style>
  .custom{
    font-size:15px;
  }
</style>
<script>
  import {mapActions,mapState} from 'vuex';
  
  export default {
    
    name: 'group-detail',
    data () {
      return {
        group: {},
        customers:[],
        types:[
            {text:"Empresa", value:"company"},
            {text:"Familia", value:"family"}
        ],
        edit:"",
      }
    },
    watch:{
        grp(val){
          if(val){
            this.group._type = this.types.find(element=>{return element.value == val._type }).text;
            this.customers = val.community
          }
        },
    },
    mounted () {
        this.edit = this.$route.params.id == undefined ? 0 : this.$route.params.id;
        if(this.edit!=""){
            this.getGroup(this.edit);
        }
    },
    methods: {
        ...mapActions({
            getGroup: 'group/getGroup', 
            setWarning: 'setWarning',
        }),
        redirect(page){
            if(page){
                this.$router.push('/groupManage/'+this.edit)
            }else{
                this.$router.push('/groupList')
            }
        }
    },
    computed:{
        ...mapState({
            warning: state => state.warning,
            grp: state => state.group.group, 
        }),
    },
  }
</script>

