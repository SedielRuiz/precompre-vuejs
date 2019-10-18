<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md10>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>{{titleText}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn v-if="edit != ''" color="error" @click="redirect(true)">Cancelar</v-btn>
            <v-btn v-if="edit == 0" color="error" @click="redirect(false)">Cancelar</v-btn>
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
                  <v-combobox v-model="customer.id_type" :items="typesIdentification" name="type_identification" prepend-icon="featured_play_list" label="Tipo de identificación"></v-combobox>
                </v-flex>
                <v-flex xs12 sm12 md6>
                  <v-text-field v-model="customer.id_description" prepend-icon="person" name="id_description" label="Número de identificación" type="text"></v-text-field>
                </v-flex>
              </v-layout>
              <v-text-field v-model="customer.email" prepend-icon="email" name="email" label="Correo" type="text"></v-text-field>
              <v-layout row wrap>
                <v-flex xs12 sm12 md6>
                  <v-select v-model="customer.gender" prepend-icon="account_box" name="gender" :items="genders" label="Genero"></v-select>
                </v-flex>
                <v-flex xs12 sm12 md6>
                  <v-text-field v-model="customer.birth_date" prepend-icon="email" name="birth_date" label="Fecha de nacimiento" type="date"></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs12 sm12 md6>
                  <v-text-field v-model="customer.campaign_code" prepend-icon="person" name="id_description" label="Código de campaña" type="text"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md6>
                  <v-select v-model="customer.store_id" prepend-icon="account_box" name="store" :items="stores" label="Tienda"></v-select>
                </v-flex>
              </v-layout>
              <v-combobox v-if="edit!=''" v-model="customer.status" :items="status" prepend-icon="check_circle_outline" label="Estado"></v-combobox>
              <h2>Teléfonos <v-icon medium @click="addNumber ? addNumber = false : addNumber = true">add</v-icon></h2><br>
              <div v-if="phones.length > 0">
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
                      <td>
                        <v-icon style="color:#bf1526;" medium @click="removePhone(props.index)">delete</v-icon>
                      </td>
                    </template>
                  </v-data-table>
                </div>  
              </div>
              <br>
              <div v-if="addNumber" class="row col-md-8">
                <v-card style="height: 100%;width: 84%; padding: 31px;">
                  <!--TELEFONOS-->
                  <label style="font-size: 18px;">Nuevo teléfono</label><hr>
                  <v-text-field v-model="phone.number" prepend-icon="call" name="number" label="Número" type="number"></v-text-field>
                  <v-combobox v-model="!phone.type ? phone.type = 'Movil' : phone.type" :items="typesPhone" prepend-icon="call" label="Tipo de número"></v-combobox>
                  <v-switch v-model="phones.length == 0 ? phone.main = true : phone.main" :label="'Principal'"></v-switch>
                  <label v-if="phones.length > 0">Recuerde que si selecciona este como principal se anularan los anteriores como principal.</label>
                  <v-btn color="primary" :disabled="phone.number ? false : true" @click="addPhone()">Agregar</v-btn>
                  <!--TELEFONOS-->
                </v-card><br>
              </div>
              <h2>Lugares de entrega <v-icon medium @click="addPlace ? addPlace = false : addPlace = true">add</v-icon></h2><br>
              <div v-if="placesSelected.length > 0">
                <v-data-table
                  :headers="headers_places"
                  :items="placesSelected"
                  hide-actions disable-initial-sort
                  class="elevation-1">
                  <template v-slot:items="props">
                    <td> {{props.item.name}} </td>
                    <td> {{props.item.place_name}} </td>
                    <td> {{props.item.cluster_title}} </td>
                    <td> {{props.item._type}} </td>
                    <td>{{ props.item.unit_u}}</td>
                    <td>
                      <v-icon style="color:#bf1526;" medium @click="removePlace(props.index)">delete</v-icon>
                    </td>
                  </template>
                </v-data-table>
              </div>
              <div v-if="addPlace" class="row col-md-8">
                <v-card style="height: 100%;width: 84%; padding: 31px;">
                  <label style="font-size: 18px;">Nuevo lugar de entrega</label><hr>
                  <!--LUGARES DE ENTREGA-->
                  <v-combobox v-model="place.name" :items="suggestions" prepend-icon="receipt" label="Nombre"></v-combobox>
                  <v-combobox v-model="placeDelivery" :items="placesDelivery" prepend-icon="location_on" label="Lugar de entrega"></v-combobox>
                  <v-layout row wrap>
                    <v-flex xs12 sm12 md6>
                      <v-combobox v-if="clusters.length > 0" v-model="cluster" :items="clusters" prepend-icon="list_alt" label="Agrupación"></v-combobox>
                    </v-flex>
                    <v-flex xs12 sm12 md6>
                      <v-combobox v-if="typesPlaces.length > 0" v-model="typeSeleted" :items="typesPlaces" prepend-icon="list_alt" label="Tipo de domicilio"></v-combobox>
                    </v-flex>
                  </v-layout>
                  <v-combobox v-if="units.length > 0" v-model="place.unit" :items="units" prepend-icon="create" label="Unidad"></v-combobox>
                  <v-btn color="primary" @click="selectedPlace()">Agregar</v-btn>
                  <!--LUGARES DE ENTREGA-->
                </v-card><br>
              </div>
              <!--v-date-picker v-model="customer.birth_date" :landscape="true" :reactive="true" label="Fecha de nacimiento"></v-date-picker-->
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
    
    name: 'customer-manage',
    data () {
      return {
        stores:[],
        customer: {},
        phone:{},
        phones:[],
        place:{},
        placesDelivery:[],
        typesPlaces:[],
        clusters:[],
        cluster:{},
        units:[],
        addPlace:false,
        addNumber:false,
        suggestions:[
          {text: 'Hogar', value:'home'},
          {text: 'Trabajo', value:'work'}  
        ],
        genders:[
          {text: 'Masculino', value:'m'},
          {text: 'Femenino', value:'f'}  
        ],
        placesSelected:[],
        placeDelivery:{},
        typeSeleted:{},
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
          {text: 'Interesado', value:'interested'},
        ],
        edit:"",
        titleText:"",
        headers_tel: [
          {text:"Principal", value:"code"},
          {text:"Numero", value:"number"},
          {text:"Codigo", value:"verification_code"},
          {text:"Verificado", value:"verified"},
          {text:"Acciones", value:"actions"}
        ],
        headers_places: [
          {text:"Nombre", value:"name"},
          {text:"Lugar", value:"place"},
          {text:"Agrupación", value:"cluster"},
          {text:"Tipo", value:"type"},
          {text:"Unidad", value:"unit"},
          {text:"Acciones", value:"actions"}
        ],
      }
    },
    watch:{
      typesPlaces(val){
        console.log(val)
      },
        cu(val){
          if(val){
            this.customer = val;
            if(val.store_id)
              this.customer.store_id = this.stores.find(element=>{return element.value == val.store_id });
            if(val.status)
              this.customer.status = this.status.find(element=>{return element.value == val.status });
            if(val.gender)
              this.customer.gender = this.genders.find(element=>{return element.value == val.gender });
            if(val.id_type)
              this.customer.id_type = this.typesIdentification.find(element=>{return element.value == val.id_type });
            this.phones = val.telephones;
            this.placesSelected = val.delivery_places;
          }
        },
        places(val){
            if(val){
                for(var s = 0; s < val.length; s++){
                    this.placesDelivery.push({ "text":val[s].name, "value":val[s]._id, "clusters":val[s].clusters });
                }
            }
        },
        cluster(val){
          var lst = [];
          var com = [];
          com = this.formatType(val.value, 'apto');
          if(com.length > 0)
            lst = com;

          com = this.formatType(val.value, 'oficina');
          if(com.length > 0)
            lst = lst.concat(com);
          console.log(lst)
          this.typesPlaces = lst;
        },
        placeDelivery(val){
            if(val){
              console.log("what")
                this.clusters = [];
                this.typeSeleted = [];
                for(var r = 0; r < val.clusters.length; r++){
                  this.clusters.push({"text":val.clusters[r].title, "id":val.clusters[r]._id, "value":val.clusters[r].floors});
                }
            }
        },
        typeSeleted(val){
            if(val){
                this.units = [];
                for(var s = 0; s < val.list.length; s++){
                  for(var r = 0; r < val.list[s].unities.units.length; r++){
                    this.units.push({"text":val.list[s].unities.units[r].u, "floor":val.list[s].floor, "value":val.list[s].unities.units[r]._id});
                  }
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
      this.edit = this.$route.params.id == undefined ? 0 : this.$route.params.id;
      if(this.edit!=""){
          this.titleText="Editar cliente"
          this.getCustomer(this.edit);
      }else{
        this.titleText="Nuevo cliente"
      }
    },
    methods: {
        ...mapActions({
            create: 'customer/create',
            update: 'customer/update',
            getCustomer: 'customer/getCustomer', 
            fetchPlaceDelivery: 'placeDelivery/fetchPlaces',
            fetchStores: 'stores/fetchStores',
            setWarning: 'setWarning',
        }),
        groupTypes(lst, type){
          var list = [];
          for(var r = 0; r < lst.length; r++){
            if(lst[r].value == type){
              list.push({"text":type, "list":lst[r].list});
            }
          }
          return list;
        },
        formatType(val, type){
          var lst = [];
          var unt = []
          for(var s = 0; s < val.length; s++){
            for(var r = 0; r < val[s].types.length; r++){
              if(val[s].types[r]._type == type){
                unt.push({floor:val[s]._id, unities:val[s].types[r]});
              }
            }
          }
          lst.push({"text":type, "value":type, "list":unt});
          return lst;
        },
        removePlace(idx){
            this.placesSelected.splice(idx,1);
            this.place = {};
            this.typeSeleted = "";
        },
        selectedPlace(){
            this.place.id = this.placeDelivery.value;
            this.place.place_name = this.placeDelivery.text;
            this.place._type = this.typeSeleted.value;
            this.place.floor = this.place.unit.floor;
            this.place.unit_u = this.place.unit.text;
            this.place.unit = this.place.unit.value;
            this.place.cluster = this.cluster.id;
            this.place.cluster_title = this.cluster.text;
            this.place.name = this.place.name && this.place.name.value ? this.place.name.value : this.place.name;
            this.placesSelected.push(this.place);
            this.place = {};
            this.typeSeleted = "";
            this.addPlace = false;
            this.placesSelected.push();
        },
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
            this.phone = {};
        },
        formatPhones(){
            for(var s = 0; s < this.phones.length; s++){
                if(this.phones[s].type)
                    this.phones[s].type = this.phones[s].type && this.phones[s].type.value ? this.phones[s].type.value : this.phones[s].type;
            }
            return this.phones;
        },
        buildCustomer(){
            this.customer.telephones = this.formatPhones();
            this.customer.id_type = this.customer.id_type && this.customer.id_type.value ? this.customer.id_type.value : this.customer.id_type;
            this.customer.gender = this.customer.gender && this.customer.gender.value ? this.customer.gender.value : this.customer.gender;
            this.customer.store_id = this.customer.store_id && this.customer.store_id.value ? this.customer.store_id.value : this.customer.store_id;
            if(this.edit){
              this.customer.status = this.customer.status && this.customer.status.value ? this.customer.status.value : this.customer.status;
            }else{
              this.customer.status = "interested";
            }
            this.customer.delivery_places = this.placesSelected;
            return this.customer;
        },
        processCustomer () {
            let data = this.buildCustomer();
            this.customer = {};
            if(this.edit){
                this.update(data).then(
                    data => {
                      this.setWarning(data, { root: true }).then(()=>{
                        this.$router.push('/customerDetail/'+this.edit)
                      })
                    },
                    error => {
                })
            }else{
                this.create(data).then(
                    data => {
                      this.setWarning(data, { root: true }).then(()=>{
                        this.$router.push('/customerList')
                      })
                    },
                    error => {
                })
            }
        },
        redirect(page){
            if(page){
                this.$router.push('/customerDetail/'+this.edit)
            }else{
                this.$router.push('/customerList')
            }
        },
        editPLace(place){
          this.placeDelivery = this.placesDelivery.find(function(pla){return pla.value === place.id});
          const { title, _id, floors } = this.placeDelivery.clusters.find(function(clu){return clu._id === place.cluster});
          this.cluster = {"text": title, "value": floors};
          this.addPlace = true;
        },
    },
    computed:{
      ...mapState({
        warning: state => state.warning,
        cu: state => state.customer.customer, 
        places: state => state.placeDelivery.places,
        strs: state => state.stores.stores,
      }),
      trySend(){
        if(this.edit){
          return false;
        }else{
          if(this.customer && this.customer.id_type && this.customer.id_description && this.customer.email && this.customer.name && this.customer.campaign_code && this.customer.store_id){
            return false; 
          }
          return true;
        }
      }
    },
  }
</script>

