<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md10>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-icon large @click="redirect(false)">keyboard_backspace</v-icon>
            <v-toolbar-title>Detalle usuario</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="success" @click="resetPass()">Recuperar contraseña</v-btn>
            <v-btn color="success" @click="redirect(true)">Editar</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form>
                <v-combobox readonly v-model="user.id_type" prepend-icon="account_box" :items="typesIdentification" label="Tipo de identificación"></v-combobox>
                <v-text-field readonly v-model="user.id_description" prepend-icon="person" name="id_description" label="Número de identificación" type="text"></v-text-field>
                <v-text-field readonly v-model="user.name" prepend-icon="person" name="name" label="Nombres" type="text"></v-text-field>
                <v-text-field readonly v-model="user.last_name" prepend-icon="person" name="last_ame" label="Apellidos" type="text"></v-text-field>
                <v-text-field readonly v-model="user.email" prepend-icon="email" name="email" label="Correo" type="text"></v-text-field>
                <v-combobox readonly v-model="user.status == 'enable' ? 'Activo' : 'Inactivo'" :items="status" prepend-icon="check_circle_outline" label="Estado"></v-combobox>
                <h2>Teléfonos</h2><br>
                <div v-if="phones">
                  <v-chip v-for="(p, index) in phones" :key="index">{{p.number}}</v-chip>
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
  import {mapActions,mapState} from 'vuex';
  
  export default {
    
    name: 'user-detail',
    data () {
      return {
        user: {},
        phone:{},
        phones:[],
        typesPhone: [
            {text: 'Fijo', value:'fijo'},
            {text: 'Celular', value:'movil'}
        ],
        typesIdentification: [
            {text: 'Tarjeta de identidad', value:'ti'},
            {text: 'Cedula de ciudadania', value:'cc'},
            {text: 'Cedula de extranjeria', value:'ce'}
        ],
        status:[
          {text: 'Activo', value:'enabled'},
          {text: 'Inactivo', value:'disabled'},
        ],
        edit:"",
      }
    },
    watch:{
        us(val){
          this.user = val;
          if(val.id_type){
            this.user.id_type = this.typesIdentification.find(element=>{return element.value == val.id_type }).text;
          }
          this.phones = val.telephones;
        },
    },
    mounted () {
        this.edit = this.$route.params.id;
        this.getUser(this.edit);
    },
    methods: {
      ...mapActions({
        setWarning: 'setWarning',
        getUser: 'user/getUser', 
        resetPassword: 'user/resetPassword', 
      }),
      resetPass(){
        if(confirm("¿ Seguro desea recuperar su contraseña. ?")){
          this.resetPassword({"id":this.user._id}).then(
                data => {
                    this.setWarning(data, { root: true }).then(()=>{
                    })
                },
                error => {
            })
        }
      },
      redirect(page){
          if(page){
              this.$router.push('/userManage/'+this.edit)
          }else{
              this.$router.push('/userList')
          }
      },
    },
    computed:{
      ...mapState({
        warning: state => state.warning,
        us: state => state.user.user, 
      }),
    },
  }
</script>

