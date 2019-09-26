<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md10>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
          <v-tooltip>
            <template v-slot:activator="{ on }">
              <v-icon large @click="redirect('back')" v-on="on" >keyboard_backspace</v-icon>
            </template>
            <span>Volver</span>
          </v-tooltip>
            <v-toolbar-title>Detalle cliente</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="success" v-show="false" click="redirect('pre')">Pre ordenes</v-btn>
            <v-btn color="success" v-show="false" @click="redirect('order')">Ordenes</v-btn>
            <v-btn color="success" v-show="false" @click="redirect('bill')">Facturas</v-btn>
          </v-toolbar>
          <div style="text-align:right;">
            <v-btn color="success" @click="resetPass()">Recuperar contraseña</v-btn>
            <v-btn color="success" @click="redirect('edit')">Editar</v-btn>
          </div>
          <v-card-text>
            <v-form style="">
              <v-layout row wrap >
                <v-flex xs12 sm12 md6>
                  <v-text-field readonly v-model="customer.name" prepend-icon="person" name="name" label="Nombres" type="text"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md6>
                  <v-text-field readonly v-model="customer.last_name" prepend-icon="person" name="last_name" label="Apellidos" type="text"></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs12 sm12 md6>
                  <v-combobox readonly v-model="customer.id_type" prepend-icon="account_box" :items="typesIdentification" label="Tipo de identificación"></v-combobox>
                </v-flex>
                <v-flex xs12 sm12 md6>
                  <v-text-field readonly v-model="customer.id_description" prepend-icon="person" name="id_description" label="Número de identificación" type="text"></v-text-field>
                </v-flex>
              </v-layout>
              <v-text-field readonly v-model="customer.campaign_code" prepend-icon="person" name="campaign_code" label="Campaña" type="text"></v-text-field>
              <v-text-field readonly v-model="customer.email" prepend-icon="email" name="email" label="Correo" type="text"></v-text-field>
              <v-combobox readonly v-model="customer.status == 'enable' ? 'Activo' : 'Inactivo'" :items="status" prepend-icon="check_circle_outline" label="Estado"></v-combobox>
              <h2>Teléfonos</h2><hr><br>
              <div v-if="phones">
                <v-chip v-for="(p, index) in phones" :key="index">{{p.number}}</v-chip>
              </div>  
              <h2>Lugares de entrega</h2><hr><br>
              <div v-if="deliveryPlaces">
                <v-chip v-for="(l, index) in deliveryPlaces" height="40px" width="115px" :key="index">{{l.name}} - {{l.cluster_title}}  {{l.unit_u}}</v-chip>
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
            if(val.id_type){
              this.customer.id_type = this.typesIdentification.find(element=>{return element.value == val.id_type }).text;
            }
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
        resetPassword: 'customer/resetPassword', 
      }),
      resetPass(){
        if(confirm("¿ Seguro desea recuperar su contraseña. ?")){
          this.resetPassword({"id":this.customer._id}).then(
                data => {
                    this.setWarning(data, { root: true }).then(()=>{
                    })
                },
                error => {
            })
        }
      },
      redirect(page){

        switch(page){
          case "edit":
            this.$router.push('/customerManage/'+this.edit)
            break;
          case "back":
            this.$router.push('/customerList')
            break;
          case "pre":
            this.$router.push('/preOrder/'+this.edit)
            break;
          case "order":
            this.$router.push('/orders/'+this.edit)
            break;
          case "bill":
            this.$router.push('/bills/'+this.edit)
            break;
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

