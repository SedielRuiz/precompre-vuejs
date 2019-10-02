<template>
  <v-container>
    <v-layout row wrap>
        <v-flex xs12 sm12 md2>
            <h1>Clientes</h1>
        </v-flex>
        <v-flex xs12 sm12 md10>
            <v-btn color="success" @click="redirect(false, 0)">Nuevo</v-btn>
            <v-btn color="success" @click="filt ? filt = false : filt = true">Filtrar</v-btn>
            <v-btn color="success">
              <downloadExcel class = "btn btn-default" :fields = "headersExcel" :data = "customers" name = "clientes.xls" type = "csv">Exportar a excel</downloadExcel>
            </v-btn>
        </v-flex>
    </v-layout>
    <div v-if="filt"><br>
      <label style="font-size:20px;">Filtros</label><hr>
      <v-layout row wrap>
        <v-flex xs12 sm12 md4>
          <v-text-field v-model="filter.name" prepend-icon="person" name="name" label="Nombres" type="text"></v-text-field>
        </v-flex>
        <v-flex xs12 sm12 md4>
          <v-text-field v-model="filter.last_name" prepend-icon="person" name="last_mame" label="Apellidos" type="text"></v-text-field>
        </v-flex>
        <v-flex xs12 sm12 md4>
          <v-text-field v-model="numberPhone" prepend-icon="phone" name="phone" label="Teléfono" type="number"></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12 sm12 md4>
          <v-text-field v-model="filter.email" prepend-icon="email" name="email" label="Correo" type="text"></v-text-field>
        </v-flex>
        <v-flex xs12 sm12 md4>
          <v-select v-model="filter.status" prepend-icon="account_box" :items="status" label="Estado"></v-select>
        </v-flex>
        <v-flex xs12 sm12 md4>
          <v-combobox v-model="delivery_place" prepend-icon="account_box" :items="delivery_places" label="Lugar de entrega"></v-combobox>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12 sm12 md3>
          <v-combobox v-model="filter.campaign_code" prepend-icon="account_box" :items="campaigns" label="Código de campaña"></v-combobox>
        </v-flex>
        <v-flex xs12 sm12 md3>
          <v-text-field v-model="verifyCode" prepend-icon="email" name="email" label="Código de verificación" type="text"></v-text-field>
        </v-flex>
        <v-spacer></v-spacer>
        <v-btn color="success" @click="searchFilter()"><v-icon medium>search</v-icon></v-btn>
        <v-btn color="success" @click="clearFilter()"><v-icon medium>delete</v-icon></v-btn>
      </v-layout>
    </div>
    <hr><br>
    <v-data-table
        :headers="headers"
        :items="customers"
        hide-actions
        class="elevation-1">
        <template v-slot:items="props">
          <td>{{ props.item.date }} <br> {{ props.item.hour }}</td>
          <td>{{ props.item.name }} {{ props.item.last_name }}</td>
          <td>{{ props.item.email }}</td>
          <td>{{ props.item.telephone }}</td>
          <td>{{ props.item.campaign_code ? props.item.campaign_code : ""}}</td>
          <td>{{ props.item.delivery }}</td>
          <td>{{ props.item.verify_code }}</td>
          <td>{{ props.item.state }}</td>
          <td>
            <v-icon medium @click="redirect(true, props.item._id)"tooltip="Detalle">more_vert</v-icon>
            <v-icon style="color:#bf1526;" medium @click="deleteCustomer(props.item._id)">delete</v-icon>
          </td>
        </template>
    </v-data-table>
    <!--pagination @search="search" :total_pages="total_pages" :total_items="total_items" :page_size="page_size"></pagination-->
  </v-container>
</template>
<style>
  .*, :after, :before{
    box-sizing: content-box !important;
  }
</style>
<script>
import Vue from 'vue'
  import {mapActions,mapState} from 'vuex';
  import pagination from '@/components/Pagination';
  import JsonExcel from 'vue-json-excel'
  Vue.component('downloadExcel', JsonExcel)

  export default {
    name: 'customer-list',
    components: {
      //pagination,
    },
    data () {
      return {
        status:[
          {text: 'Activo', value:'enabled'},
          {text: 'Inactivo', value:'disabled'},
          {text: 'Interesado', value:'interested'},
        ],
        headers: [
          {text:"Fecha de ingreso", value:"date"},
          {text:"Nombre", value:"name"},
          {text:"Correo", value:"email"},
          {text:"Teléfono", value:"telephone"},
          {text:"Campaña", value:"campaign_code"},
          {text:"Lugar de entrega", value:"delivery"},
          {text:"Código de verificación", value:"verify_code"},
          {text:"Estado", value:"state"},
          {text:"Acciones", value:"actons"}
        ],
        headersExcel:{
          "Fecha de ingreso":"date",
          "Hora de ingreso":"hour",
          "Nombre":"name",
          "Apellido":"last_name",
          "Correo":"email",
          "Teléfono":"telephone",
          "Campaña":"campaign_code",
          "Lugar de entrega":"delivery",
          "Código de verificación":"verify_code",
          "Estado":"state",
        },
        customers:[],
        verify:false,
        verify_code:"",
        info:"",
        filt:false,
        filter:{},
        campaigns:[],
        numberPhone:"",
        verifyCode:"",
        delivery_place:"",
        delivery_places:[],
      }
    },
    watch:{
        campa(val){
          if(val){ 
              for(var s = 0; s < val.length; s++){
                this.campaigns.push({ "text":val[s].code_promo, "value":val[s].code_promo });
              }
          }
        },
        places(val){
          if(val){
            for(var s = 0; s < val.length; s++){
              this.delivery_places.push({ text:val[s].name, value:val[s]._id });
            }
          }
        },
        rows(val){  
          if(val && this.places){
            this.customers = [];
            for(var s = 0; s < val.length; s++){
              val[s].hour = this.getHour(val[s].created_at);
              val[s].date = val[s].created_at.split("T")[0].split("-")[2] +"/"+val[s].created_at.split("T")[0].split("-")[1] +"/"+val[s].created_at.split("T")[0].split("-")[0];
              val[s].delivery = this.deliveryPlace(val[s].delivery_places && val[s].delivery_places.length > 0 ? val[s].delivery_places[0] : 0);
              switch(val[s].status){
                case "enabled": val[s].state = "Activo"; break;
                case "disabled": val[s].state = "Inactivo"; break;
                case "interested": val[s].state = "Interesado"; break;
              }
              var tel = val[s].telephones.length > 0 ? val[s].telephones.find(element=>{return element.main == true}) : "";
              if(tel != "" && tel != undefined){
                val[s].telephone = tel.number;
                val[s].verify_code = tel.verified ? "Verificado" : tel.verification_code;
              }else{
                val[s].telephone = "";
                val[s].verify_code = ""; 
              }
              this.customers.push(val[s]);
            }
          }
        }
    },
    mounted () {
      this.fetchPlaceDelivery({page_size:-1});
      this.fetchCustomers({page_size:50});
      this.fetchCampaigns({page_size:-1});
    },
    methods: {
      ...mapActions({
        fetchCustomers: 'customer/fetchCustomers',
        fetchFilter: 'customer/fetchFilter',
        fetchCampaigns: 'campaign/fetchCampaigns',
        fetchPlaceDelivery: 'placeDelivery/fetchPlaces',
        delete: 'customer/delete',
        setWarning: 'setWarning',
      }),
      clearFilter(){
        this.filter = {};
        this.verifyCode = "";
        this.delivery_place = "";
        this.numberPhone = "";
        this.fetchCustomers({page_size:50});
      },
      deliveryPlace(place){
        var delivery = "";
        if(place){
          var c;
          var f;
          var t;
          var u;
          var p = this.places.find(element=>{return element._id == place.id});
          if(p){
            c = p.clusters.find(element=>{return element._id == place.cluster});
          }
          if(c){
            delivery += p.name + " - ";
            delivery += c.title + " - ";
            f = c.floors.find(element=>{return element._id == place.floor});
          }
          if(f){
            t = f.types.find(element=>{return element._type == place._type});
          }
          if(t){
            u = t.units.find(element=>{return element._id == place.unit});
          }
          if(u){
            delivery += u.u;
          }
        }
        return delivery;
      },
      getHour(date){
        var dt = new Date(date);
        return (dt.getHours() < 10 ? "0"+dt.getHours() : dt.getHours())+":"+(dt.getMinutes() < 10 ? "0"+dt.getMinutes() : dt.getMinutes())+":"+(dt.getSeconds() < 10 ? "0"+dt.getSeconds() :dt.getSeconds());
      },
      searchFilter(){
        if(this.numberPhone || this.verifyCode){
          var telephones =  { $elemMatch: { } };
        }
        if(this.numberPhone){
          telephones.$elemMatch.number = this.numberPhone;
        }
        if(this.verifyCode){
          telephones.$elemMatch.verification_code = this.verifyCode;
        }
        if(this.filter.campaign_code){
          this.filter.campaign_code = this.filter.campaign_code && this.filter.campaign_code.value ? this.filter.campaign_code.value : this.filter.campaign_code;
        }
        if(this.delivery_place){
          var delivery = { $elemMatch: { id: this.delivery_place && this.delivery_place.value ? this.delivery_place.value : this.delivery_place } };
        }
        for (const flt in this.filter) {
          if(this.filter[flt] == "")
            delete this.filter[flt];
        }

        if(JSON.stringify(this.filter)!='{}' || JSON.stringify(telephones)!='{}' || JSON.stringify(delivery)!='{}'){
          this.fetchFilter({"filters":this.filter, "telephones":telephones, "delivery": delivery});
        }
        if(JSON.stringify(this.filter)=='{}' && !telephones && !delivery){
          this.fetchCustomers({page_size:50});
        }
      },
      deleteCustomer(id){
        if(confirm("¿ Seguro que desea eliminar este registro ? ")){
          this.delete(id).then(
            data => {
              this.setWarning(data, { root: true }).then(()=>{
                this.fetchCustomers({page_size:50});
              })
            },
            error => {
              console.log(error);
            });
        }
      },
      search(pagination){
        this.fetchCustomers(pagination);
      },
      redirect(page,id){
        if(!page){
            this.$router.push('/customerManage')
        }else{
            this.$router.push('/customerDetail/'+id)
        }
      }
    },
    computed:{
      ...mapState({
        warning: state => state.warning,
        rows: state => state.customer.customers,
        page_size: state => state.customer.page_size,
        total_items: state => state.customer.total_items,
        total_pages: state => state.customer.total_pages,
        campa: state => state.campaign.campaigns,
        places: state => state.placeDelivery.places,
      }),
    },
  }
</script>

