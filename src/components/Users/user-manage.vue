<template>
  <v-container>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>{{titleText}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn v-if="edit != ''" color="error" @click="redirect(true)">Cancelar</v-btn>
            <v-btn v-if="edit == 0" color="error" @click="redirect(false)">Cancelar</v-btn>
          </v-toolbar>
          <v-card-text>
              <v-layout row wra>
                <v-flex xs12 sm12 md6>
                  <v-text-field class="col-xs-12 col-sm-12 col-md-6" v-model="user.name" prepend-icon="person" name="name" label="Nombres" type="text"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md6>
                  <v-text-field v-model="user.last_name" prepend-icon="person" name="last_mame" label="Apellidos" type="text"></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row wra>
                <v-flex xs12 sm12 md6>
                  <v-combobox v-model="user.id_type" prepend-icon="account_box" :items="typesIdentification" label="Tipo de identificación"></v-combobox>
                </v-flex>
                <v-flex xs12 sm12 md6>
                  <v-text-field v-model="user.id_description" prepend-icon="person" name="id_description" label="Número de identificación" type="text"></v-text-field>
                </v-flex>
              </v-layout>
                <v-text-field v-model="user.email" prepend-icon="email" name="email" label="Correo" type="text"></v-text-field>
                <v-combobox v-if="edit!=''" v-model="user.status == 'enable' ? 'Activo' : 'Inactivo'" :items="status" prepend-icon="check_circle_outline" label="Estado"></v-combobox>
                <!--v-text-field v-if="edit==''" v-model="user.password" prepend-icon="lock" name="password" label="Contraseña" type="password"></v-text-field-->
                <h2>Teléfonos <v-icon medium @click="addNumber ? addNumber = false : addNumber = true">add</v-icon></h2><br>
                <div v-if="phones.length > 0">
                  <v-chip v-for="(p, index) in phones" :key="index">{{p.number}} <v-icon medium @click="removePhone(index)">close</v-icon></v-chip>
                </div>
                <br>
                <div v-if="addNumber" class="row col-md-8">
                  <v-card style="height: 100%;width: 84%; padding: 31px;">
                    <!--TELEFONOS-->
                    <label style="font-size: 18px;">Nuevo teléfono</label><hr>
                    <v-alert :value="phone.e" type="error">{{phone.error}}</v-alert>
                    <v-text-field v-model="phone.number" prepend-icon="call" name="number" label="Número" type="number"></v-text-field>
                    <v-combobox v-model="!phone.type ? phone.type = 'Movil' : phone.type" :items="typesPhone" prepend-icon="call" label="Tipo de número"></v-combobox>
                    <v-switch v-model="phones.length == 0 ? phone.main = true : phone.main" :label="'Principal'"></v-switch>
                    <v-btn color="primary" @click="addPhone()">Agregar</v-btn>
                    <!--TELEFONOS-->
                  </v-card><br>
                </div>
                <label style="font-size: 19px;">Fecha de nacimiento.</label><br>
                <v-date-picker v-model="user.birth_date" :landscape="true" :reactive="true" label="Fecha de nacimiento"></v-date-picker>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" :disabled="trySend" style="width: 100%;" @click="processUser()">Guardar</v-btn>
          </v-card-actions>
        </v-card>
  </v-container>
</template>

<script>
  import {mapActions,mapState} from 'vuex';
  
  export default {
    
    name: 'user-manage',
    data () {
      return {
        user: {},
        phone:{},
        phones:[],
        addNumber:false,
        typesPhone: [
          {text: 'Movil', value:'movil'},
          {text: 'Hogar', value:'home'}
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
        titleText:""
      }
    },
    watch:{
        us(val){
          if(val){
            this.user = val;
            this.user.id_type = this.typesIdentification.find(element=>{return element.value == val.id_type });
            this.phones = val.telephones;
          }
        },
    },
    mounted () {
        this.edit = this.$route.params.id == undefined ? 0 : this.$route.params.id;
        if(this.edit!=""){
            this.titleText="Editar usuario"
            this.getUser(this.edit);
        }else{
          this.titleText="Nuevo usuario"
        }
    },
    methods: {
      ...mapActions({
        create: 'user/create',
        update: 'user/update',
        getUser: 'user/getUser', 
        setWarning: 'setWarning',
      }),
      addPhone(){
        for(var s = 0; s < this.phones.length; s++){
          if(this.phone.main == true && this.phones[s].main == true){
            this.phone.error = "Ya tiene un teléfono principal.";
            this.phone.e = true;
            break;
          }else{
            console.log("aca");
            this.phone.e = false;
            this.phone.error = "";
          }
        }
        if(!this.phone.e){
          this.phones.push(this.phone);
          this.phone = {};
          this.addNumber = false;
        }
      },
      removePhone(idx){
        this.phones.splice(idx,1);
        this.phone = {};
      },
      formatPhones(){
        for(var s = 0; s < this.phones.length; s++){
          if(this.phones[s].type)
            this.phones[s].type = this.phones[s].type && this.phones[s].type.value ? this.phones[s].type.value : this.phones[s].type;
        }
        return this.phones;
      },
      buildUser(){
        this.user.telephones = this.formatPhones();
        this.user.id_type = this.user.id_type && this.user.id_type.value ? this.user.id_type.value : this.user.id_type;
        if(this.edit)
          this.user.status = this.user.status.value;
        this.user.password = "admin123";
        return this.user;
      },
      processUser () {
        this.user = this.buildUser();
        console.log(this.user);
        if(this.edit){
            this.update(this.user).then(
                data => {
                    this.setWarning(data, { root: true }).then(()=>{
                        this.$router.push('/userDetail/'+this.edit)
                    })
                },
                error => {
            })
        }else{
            this.create(this.user).then(
                data => {
                    this.setWarning(data, { root: true }).then(()=>{
                        this.$router.push('/login')
                    })
                },
                error => {
            })
        }
      },
      redirect(page){
        if(!this.logged){
          this.$router.push('/login')
        }else{
          if(page){
            this.$router.push('/userDetail/'+this.edit)
          }else{
            this.$router.push('/userList')
          }
        }
      }
    },
    computed:{
      ...mapState({
        warning: state => state.warning,
        logged: state => state.auth.logged,
        us: state => state.user.user, 
      }),
      trySend(){
        if(this.user && this.user.id_type && this.user.id_description && this.user.email && this.user.name){
          return false; 
        }
        return true;
      }
    },
  }
</script>

