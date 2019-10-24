<template>
  <v-container>
    <v-layout row wrap justify-center>
      <v-flex sm12 xs12 md10>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>{{titleText}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn v-if="edit != '' && edit != 1" color="error" @click="redirect(true)">Cancelar</v-btn>
            <v-btn v-if="edit == 0" color="error" @click="redirect(false)">Cancelar</v-btn>
          </v-toolbar>
          <v-card-text>
          <v-layout row wrap>
            <v-flex sm12 xs12 md6>
              <v-text-field class="col-xs-12 col-sm-12 col-md-12" v-model="user.name" prepend-icon="person" name="name" label="Nombres" type="text"></v-text-field>
            </v-flex>
            <v-flex sm12 xs12 md6>
              <v-text-field class="col-xs-12 col-sm-12 col-md-12" v-model="user.last_name" prepend-icon="person" name="last_mame" label="Apellidos" type="text"></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex sm12 xs12 md6>
              <v-combobox class="col-xs-12 col-sm-12 col-md-12" v-model="user.id_type" prepend-icon="account_box" :items="typesIdentification" label="Tipo de identificación"></v-combobox>
            </v-flex>
            <v-flex sm12 xs12 md6>
              <v-text-field class="col-xs-12 col-sm-12 col-md-12" v-model="user.id_description" prepend-icon="person" name="id_description" label="Número de identificación" type="text"></v-text-field>
            </v-flex>
          </v-layout>
          <v-text-field v-model="user.email" prepend-icon="email" name="email" label="Correo" type="text"></v-text-field>
          <h2 v-if="edit==1">Cambiar contraseña <v-icon medium @click="addPass ? addPass = false : addPass = true">add</v-icon></h2>
          <div v-if="addPass && edit==1" class="row col-md-8"><br>
            <v-alert :value="next" type="info">Las contraseñas no coinciden.</v-alert>
            <v-text-field v-if="edit==1" v-model="password" prepend-icon="lock" name="password" label="Nueva contraseña" type="password"></v-text-field>
            <v-text-field v-if="edit==1" v-model="confirmPassword" prepend-icon="lock" name="password" label="Confirma contraseña" type="password"></v-text-field>
          </div>
          <v-combobox v-if="edit != 1 && usr.role == 'super user'" class="col-xs-12 col-sm-12 col-md-12" v-model="user.role_id" prepend-icon="account_box" :items="roles" label="Rol"></v-combobox>
          <v-select v-if="edit!='' && edit != 1 && usr.role == 'super user'" v-model="user.status" :items="status" prepend-icon="check_circle_outline" label="Estado"></v-select>
          <h2>Teléfonos <v-icon medium @click="addNumber ? addNumber = false : addNumber = true">add</v-icon></h2><br>
          <div v-if="phones.length > 0">
            <v-chip v-for="(p, index) in phones" :key="index">{{p.number}} <v-icon medium @click="removePhone(index)">close</v-icon></v-chip>
          </div>
          <br>
          <div v-if="addNumber" class="row col-md-8">
            <v-card style="height: 100%;width: 84%; padding: 31px;">
              <!--TELEFONOS-->
              <label style="font-size: 18px;">Nuevo teléfono</label><hr>
              <v-text-field v-model="phone.number" prepend-icon="call" name="number" label="Número" type="number"></v-text-field>
              <v-combobox v-model="!phone.type ? phone.type = 'Movil' : phone.type" :items="typesPhone" prepend-icon="call" label="Tipo de número"></v-combobox>
              <label v-if="phones.length > 0">Recuerde que si selecciona este como principal se anularan los anteriores como principal.</label>
              <v-switch v-model="phones.length == 0 ? phone.main = true : phone.main" :label="'Principal'"></v-switch>
              <v-btn color="primary" :disabled="phone.number ? false : true" @click="addPhone()">Agregar</v-btn>
              <!--TELEFONOS-->
            </v-card><br>
          </div>
          <!--v-date-picker v-model="user.birth_date" :landscape="true" :reactive="true" label="Fecha de nacimiento"></v-date-picker-->
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" :disabled="trySend" style="width: 100%;" @click="processUser()">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
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
        roles:[],
        addNumber:false,
        addPass:false,
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
          {text: 'Activo', value:'enable'},
          {text: 'Inactivo', value:'disabled'},
        ],
        edit:"",
        titleText:"",
        password:"",
        confirmPassword:"",
        next:false,
      }
    },
    watch:{
        us(val){
          if(val){
            this.user = val;
            this.user.id_type = this.typesIdentification.find(element=>{return element.value == val.id_type });
            if(val.role_id){
              this.user.role_id = this.roles.find(element=>{return element.value == val.role_id });
            }
            if(val.status){
              this.user.status = this.status.find(element=>{return element.value == val.status });
            }
            this.phones = val.telephones;
          }
        },
        rls(val){
          for(var s = 0; s < val.length; s++){
            this.roles.push({"text":val[s].title, "value":val[s]._id});
          }
        },
    },
    mounted () {
      this.fetchRoles().then(data=>{
        this.edit = this.$route.params.id == undefined ? 0 : this.$route.params.id;
        console.log(this.usr);
        if(this.edit!=""){
            if(this.edit == 1){
              this.getUser(this.usr._id);
              this.titleText="Perfil"
            }
            else{
              this.titleText="Editar usuario"
              this.getUser(this.edit);
            }
        }else{
          this.titleText="Nuevo usuario"
        }
      },error=>{});
    },
    methods: {
      ...mapActions({
        create: 'user/create',
        update: 'user/update',
        fetchRoles: 'role/fetchRoles',
        getUser: 'user/getUser', 
        setWarning: 'setWarning',
      }),
      addPhone(){
        if(this.phone.number){
          for(var s = 0; s < this.phones.length; s++){
            if(this.phone.main == true && this.phones[s].main == true){
              this.phones[s].main = false;
            }
          }
          this.phones.push(this.phone);
          this.phone = {};
          this.addNumber = false;
        }
      },
      removePhone(idx){
        this.phones.splice(idx,1);
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
        this.user.role_id = this.user.role_id && this.user.role_id.value ? this.user.role_id.value : this.user.role_id;
        if(this.edit && this.edit != 1){
          this.user.status = this.user.status.value;
        }
        delete this.user.password;
        return this.user;
      },
      processUpdate(user){
        this.update(user).then(
          data => {
            this.setWarning(data, { root: true }).then(()=>{
              if(this.edit == 1){
                this.$router.push('/');
              }else{
                this.$router.push('/userDetail/'+this.edit);
              }
            });
          },
          error => {
        });
      },
      processUser () {
        this.user = this.buildUser();
        if(this.edit){
            if(this.password){
              if(this.password != this.confirmPassword){
                this.next = true;
              }else{
                this.next = false;
                this.user.password = this.password;
                this.processUpdate(this.user);
              }
            }else{
              this.processUpdate(this.user);
            }
        }else{
            this.create(this.user).then(
                data => {
                    this.setWarning(data, { root: true }).then(()=>{
                        this.$router.push('/userList')
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
        usr: state => state.auth.user, 
        rls: state => state.role.roles,
      }),
      trySend(){
        if(this.user && this.user.id_type && this.user.id_description && this.user.email && this.user.name && this.user.role_id){
          return false; 
        }
        return true;
      }
    },
  }
</script>

