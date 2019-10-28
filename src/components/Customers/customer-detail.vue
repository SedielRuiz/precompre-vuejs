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
            <v-btn color="success" @click="resetPass()">Recuperar contraseña</v-btn>
            <v-btn color="success" @click="redirect('edit')">Editar</v-btn>
          </v-toolbar>
          <div style="text-align:right;">
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
              <v-text-field readonly v-model="customer.email" prepend-icon="email" name="email" label="Correo" type="text"></v-text-field>
              <v-layout row wrap>
                <v-flex xs12 sm12 md6>
                  <v-combobox readonly v-model="customer.gender" prepend-icon="account_box" :items="genders" label="Genero"></v-combobox>
                </v-flex>
                <v-flex xs12 sm12 md6>
                  <v-text-field readonly v-model="customer.birth_date" prepend-icon="person" name="birth_date" label="Fecha de nacimiento" type="date"></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs12 sm12 md6>
                  <v-text-field readonly v-model="customer.campaign_code" prepend-icon="person" name="campaign_code" label="Campaña" type="text"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md6>
                  <v-select v-model="customer.store_id" prepend-icon="account_box" name="store" :items="stores" label="Tienda"></v-select>
                </v-flex>
              </v-layout>
              <v-combobox readonly v-model="customer.status" :items="status" prepend-icon="check_circle_outline" label="Estado"></v-combobox>
              <div>
                <observations :routeFetch="'customers'" :routeEdit="'edit_customer'" :obs="customer.observations && customer.observations.length > 0 ? customer.observations : []" :id="this.$route.params.id == undefined ? 0 : this.$route.params.id" :last="true"></observations>
              </div>
              <h2>Teléfonos</h2><hr><br>
              <div v-if="phones">
                <v-data-table
                  :headers="headers_tel"
                  :items="phones"
                  hide-actions disable-initial-sort
                  class="elevation-1">
                  <template v-slot:items="props">
                    <td>
                        <v-icon medium>{{props.item.main ? "check" : "" }}</v-icon> 
                    </td>
                    <td>{{ props.item.number }}</td>
                    <td>{{ props.item.verification_code}}</td>
                    <td>
                      <v-icon medium>{{props.item.verified ? "check_circle_outline" : "" }}</v-icon> 
                    </td>
                  </template>
                </v-data-table>
              </div>  
              <h2>Lugares de entrega</h2><hr><br>
              <v-data-table
                :headers="headers_places"
                :items="deliveryPlaces"
                hide-actions disable-initial-sort
                class="elevation-1">
                <template v-slot:items="props">
                  <td> {{props.item.name}} </td>
                  <td> {{props.item.place_name}} </td>
                  <td> {{props.item.cluster_title}} </td>
                  <td> {{props.item._type}} </td>
                  <td> {{props.item.floor_number}} </td>
                  <td>{{ props.item.unit_u}}</td>
                </template>
              </v-data-table>
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
  import Observations from "@/components/Observations";

  export default {
    name: 'user-detail',
    components:{
      Observations,
    },
    data () {
      return {
        customer: {},
        phone:{},
        phones:[],
        deliveryPlaces:[],
        stores:[],
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
          {text: 'Interesado', value:'interested'},
        ],
        genders:[
          {text: 'Masculino', value:'m'},
          {text: 'Femenino', value:'f'}  
        ],
        edit:"",
        headers_tel: [
            {text:"Principal", value:"code"},
            {text:"Numero", value:"number"},
            {text:"Codigo", value:"verification_code"},
            {text:"Verificado", value:"verified"},
        ],
        headers_places: [
            {text:"Nombre", value:"name"},
            {text:"Lugar", value:"place"},
            {text:"Agrupación", value:"cluster"},
            {text:"Tipo", value:"type"},
            {text:"Piso", value:"floor"},
            {text:"Unidad", value:"unit"},
        ],
      }
    },
    watch:{
        cu(val){
            this.customer = val;
            if(val.store_id)
              this.customer.store_id = this.stores.find(element=>{return element.value == val.store_id });
            if(val.gender)
              this.customer.gender = this.genders.find(element=>{return element.value == val.gender });
            if(val.status)
              this.customer.status = this.status.find(element=>{return element.value == val.status });
            if(val.id_type){
              this.customer.id_type = this.typesIdentification.find(element=>{return element.value == val.id_type }).text;
            }
            if(val.birth_date){
              this.customer.birth_date = val.birth_date.split("T")[0];
            }
            this.phones = val.telephones;
            this.deliveryPlaces = val.delivery_places;
        },
        strs(val){
          for(var s = 0; s < val.length; s++){
            this.stores.push({text:val[s].name, value:val[s]._id});
          }
        },
    },
    mounted () {
      this.fetchStores({page_size:-1});
      this.edit = this.$route.params.id;
      this.getCustomer(this.edit);
    },
    methods: {
      ...mapActions({
        setWarning: 'setWarning',
        getCustomer: 'customer/getCustomer', 
        fetchStores: 'stores/fetchStores',
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
        strs: state => state.stores.stores,
      }),
    },
  }
</script>

