<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md10>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Registro rápido</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="redirect()">Cancelar</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form>
                <v-layout row wrap>
                  <v-flex xs12 sm12 md6>
                    <v-text-field v-model="customer.name" prepend-icon="person" name="name" label="Nombres" type="text"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md6>
                    <v-text-field v-model="customer.last_name" prepend-icon="person" name="last_mame" label="Apellidos" type="text"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs12 sm12 md6>
                    <v-text-field v-model="phone" prepend-icon="person" name="phone" label="Teléfono" type="number"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md6>
                      <v-combobox v-model="deliveryCode" prepend-icon="account_box" :items="deliveryCodes" label="Código de lugar de entrega"></v-combobox>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                    <v-flex xs12 sm12 md6>
                      <v-combobox v-model="campaigCode" :items="campaigCodes" prepend-icon="featured_play_list" label="Código de campaña"></v-combobox>
                    </v-flex>
                    <v-flex xs12 sm12 md6>
                      <v-select v-model="customer.store_id" prepend-icon="account_box" name="store" :items="stores" label="Tienda"></v-select>
                    </v-flex>
                </v-layout>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" :disabled="trySend" style="width: 100%;" @click="processCustomer()">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import {mapActions,mapState} from 'vuex';
  
  export default {
    
    name: 'fast-register',
    data () {
      return {
        campaigCode:"",
        campaigCodes:[],
        deliveryCode:"",
        deliveryCodes:[],
        customer: {},
        phone:"",
        stores:[],
      }
    },
    watch:{
      places(val){
          if(val){
              for(var s = 0; s < val.length; s++){
                  this.deliveryCodes.push({ "text":val[s].welcome_code, "value":val[s]._id });
              }
          }
      },
      campa(val){
          if(val){
              for(var s = 0; s < val.length; s++){
                  this.campaigCodes.push({ "text":val[s].code_promo, "value":val[s].code_promo });
              }
          }
      },
      strs(val){
        for(var s = 0; s < val.length; s++){
          this.stores.push({text:val[s].name, value:val[s]._id});
          this.customer.store_id = this.stores[0];
        }
      },
    },
    mounted () {
      this.fetchStores({page_size:-1});
      this.fetchPlaceDelivery({page_size:-1});
      this.fetchCampaigns({page_size:-1});
    },
    methods: {
        ...mapActions({
          create: 'customer/create',
          fetchPlaceDelivery: 'placeDelivery/fetchPlaces',
          fetchCampaigns: 'campaign/fetchCampaigns',
          fetchStores: 'stores/fetchStores',
          setWarning: 'setWarning',
        }),
        buildCustomer(){
            this.customer.telephones = [{number:this.phone, main:true}]
            this.customer.campaign_code = this.campaigCode && this.campaigCode.value ? this.campaigCode.value : this.campaigCode;
            this.customer.store_id = this.customer.store_id && this.customer.store_id.value ? this.customer.store_id.value : this.customer.store_id;
            if(this.deliveryCode){
              this.customer.code_delivery_place = this.deliveryCode && this.deliveryCode.value ? this.deliveryCode.value : this.deliveryCode;
            }
            return this.customer;
        },
        processCustomer () {
            this.customer = this.buildCustomer();
            this.create(this.customer).then(
                data => {
                    this.setWarning(data, { root: true }).then(()=>{
                        this.$router.push('/verifyCode')
                    })
                },
                error => {
            });
        },
        redirect(){
            this.$router.push('/')
        }
    },
    computed:{
      ...mapState({
        warning: state => state.warning,
        cu: state => state.customer.customer, 
        places: state => state.placeDelivery.places,
        campa: state => state.campaign.campaigns,
        strs: state => state.stores.stores,
      }),
      trySend(){
        if(this.edit){
          return false;
        }else{
          if(this.customer && this.customer.name){
            return false; 
          }
          return true;
        }
      }
    },
  }
</script>

