<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md10>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Detalle usuario</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="success" @click="redirect(true)">Editar</v-btn>
            <v-btn color="success" @click="redirect(false)">Volver</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form>
                <v-combobox :disabled="true" v-model="phone.id_type" prepend-icon="email" :items="typesIdentification" label="Tipo de identificación"></v-combobox>
                <v-text-field :disabled="true" v-model="user.id_description" prepend-icon="email" name="id_description" label="Número de identificación" type="text"></v-text-field>
                <v-text-field :disabled="true" v-model="user.name" prepend-icon="email" name="name" label="Nombres" type="text"></v-text-field>
                <v-text-field :disabled="true" v-model="user.last_ame" prepend-icon="email" name="last_ame" label="Apellidos" type="text"></v-text-field>
                <v-text-field :disabled="true" v-model="user.email" prepend-icon="email" name="email" label="Correo" type="text"></v-text-field>
                <h2>Teléfonos</h2><br>
                <v-chip v-for="(p, index) in phones">{{p.number}}</v-chip>
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
  import {mapActions,mapGetters,mapState} from 'vuex';
  
  export default {
    
    name: 'user-manage',
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
            {text: 'Tarjeta de identidad', value:'tarjetadeidentidad'},
            {text: 'Cedula de ciudadania', value:'ceduladeciudadania'},
            {text: 'Cedula de extranjeria', value:'ceduladeextranjeria'}
        ],
        edit:"",
      }
    },
    mounted () {
        this.edit = this.$route.params.id;
        this.getUser(this.edit);
        this.getPhones(this.edit);
    },
    methods: {
      ...mapActions({
        create: 'user/create',
        setWarning: 'setWarning',
      }),
      ...mapGetters({
        getUser: 'user/getUser', 
        getPhones: 'user/getPhones', 
      }),
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
        warning: state => state.warning
      }),
    },
  }
</script>

