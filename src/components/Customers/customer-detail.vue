<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md10>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Detalle cliente</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="success" @click="redirect(true)">Editar</v-btn>
            <v-btn color="success" @click="redirect(false)">Volver</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form>
                <v-combobox :disabled="true" v-model="customer.id_type" prepend-icon="email" :items="typesIdentification" label="Tipo de identificación"></v-combobox>
                <v-text-field :disabled="true" v-model="customer.id_description" prepend-icon="email" name="id_description" label="Número de identificación" type="text"></v-text-field>
                <v-text-field :disabled="true" v-model="customer.name" prepend-icon="email" name="name" label="Nombres" type="text"></v-text-field>
                <v-text-field :disabled="true" v-model="customer.last_ame" prepend-icon="email" name="last_ame" label="Apellidos" type="text"></v-text-field>
                <v-text-field :disabled="true" v-model="customer.email" prepend-icon="email" name="email" label="Correo" type="text"></v-text-field>
                <h2>Teléfonos</h2><hr><br>
                <div v-if="phones">
                  <v-chip v-for="(p, index) in phones" :key="index">{{p.number}}</v-chip>
                </div>  
                <h2>Lugares de entrega</h2><hr><br>
                <div v-if="deliveryPlaces">
                  <v-chip v-for="(l, index) in deliveryPlaces" height="40px" width="115px" :key="index">{{l.name}} - {{l.unit_name}}</v-chip>
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
        customer: {},
        phone:{},
        phones:[],
        deliveryPlaces:[],
        typesPhone: [
            {text: 'Fijo', value:'fijo'},
            {text: 'Celular', value:'movil'}
        ],
        typesIdentification: [
            {text: 'Tarjeta de identidad', value:'ti'},
            {text: 'Cedula de ciudadania', value:'cc'},
            {text: 'Cedula de extranjeria', value:'ce'}
        ],
        edit:"",
      }
    },
    watch:{
        cu(val){
            this.customer = val;
            this.customer.id_type = this.typesIdentification.find(element=>{return element.value == val.id_type }).text;
            this.phones = val.telephones;
            this.deliveryPlaces = val.delivery_places;
        },
    },
    mounted () {
        this.edit = this.$route.params.id;
        this.getCustomer(this.edit);
    },
    methods: {
      ...mapActions({
        setWarning: 'setWarning',
        getCustomer: 'customer/getCustomer', 
      }),
      redirect(page){
          if(page){
              this.$router.push('/customerManage/'+this.edit)
          }else{
              this.$router.push('/customerList')
          }
      },
    },
    computed:{
      ...mapState({
        warning: state => state.warning,
        cu: state => state.customer.customer, 
      }),
    },
  }
</script>

