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
              <v-layout row wra>
                <v-flex xs12 sm12 md6>
                  <v-text-field v-model="customer.name" prepend-icon="person" name="name" label="Nombres" type="text"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md6>
                  <v-text-field v-model="customer.last_name" prepend-icon="person" name="last_mame" label="Apellidos" type="text"></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row wra>
                <v-flex xs12 sm12 md6>
                  <v-select v-model="customer.id_type" :items="typesIdentification" prepend-icon="featured_play_list" label="Tipo de identificación"></v-select>
                </v-flex>
                <v-flex xs12 sm12 md6>
                  <v-text-field v-model="customer.id_description" prepend-icon="person" name="id_description" label="Número de identificación" type="text"></v-text-field>
                </v-flex>
              </v-layout>
                <v-select v-model="customer.gender" prepend-icon="account_box" :items="genders" label="Genero"></v-select>
                <v-text-field v-model="customer.email" prepend-icon="email" name="email" label="Correo" type="text"></v-text-field>
                <v-combobox v-if="edit!=''" v-model="customer.status == 'enable' ? 'Activo' : 'Inactivo'" :items="status" prepend-icon="check_circle_outline" label="Estado"></v-combobox>
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
                    <v-switch v-model="phones.length == 0 ? phone.main = true : phone.main" :label="'Principal'"></v-switch>
                    <label v-if="phones.length > 0">Recuerde que si selecciona este como principal se anularan los anteriores como principal.</label>
                    <v-btn color="primary" :disabled="phone.number ? false : true" @click="addPhone()">Agregar</v-btn>
                    <!--TELEFONOS-->
                  </v-card><br>
                </div>
                <h2>Lugares de entrega <v-icon medium @click="addPlace ? addPlace = false : addPlace = true">add</v-icon></h2><br>
                <div v-if="placesSelected.length > 0">
                  <v-chip v-for="(p, index) in placesSelected" :key="index">{{p.name}} <v-icon medium @click="removePlace(index)">close</v-icon></v-chip>
                </div>
                <div v-if="addPlace" class="row col-md-8">
                  <v-card style="height: 100%;width: 84%; padding: 31px;">
                    <label style="font-size: 18px;">Nuevo lugar de entrega</label><hr>
                    <!--LUGARES DE ENTREGA-->
                    <v-combobox v-model="place.name" :items="suggestions" prepend-icon="receipt" label="Nombre"></v-combobox>
                    <v-combobox v-model="placeDelivery" :items="placesDelivery" prepend-icon="location_on" label="Lugar de entrega"></v-combobox>
                    <v-layout row wra>
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
              <label style="font-size: 19px;">Fecha de nacimiento.</label><br>
              <v-date-picker v-model="customer.birth_date" :landscape="true" :reactive="true" label="Fecha de nacimiento"></v-date-picker>
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
        customer: {},
        phone:{},
        phones:[],
        place:{},
        placesDelivery:[],
        typesPlaces:[],
        clusters:[],
        cluster:"",
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
        placeDelivery:"",
        typeSeleted:"",
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
        cu(val){
          if(val){
            this.customer = val;
            if(val.id_type)
              this.customer.id_type = this.typesIdentification.find(element=>{return element.value == val.id_type });
            this.phones = val.telephones;
            for(var s = 0; s < val.delivery_places.length; s++){
              this.placesSelected.push({"name":val.delivery_places[s].name, "id":val.delivery_places[s].id, "unit":val.delivery_places[s].unit, "_type":val.delivery_places[s]._type});
            }
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
          console.log(val.value);
          var com = [];
          com = this.formatType(val.value, 'apto');
          if(com.length > 0)
            lst = com;

          com = this.formatType(val.value, 'oficina');
          if(com.length > 0)
            lst = lst.concat(com);
            
          this.typesPlaces = lst;
        },
        placeDelivery(val){
            if(val){
                this.clusters = [];
                this.typesPlaces = [];
                for(var r = 0; r < val.clusters.length; r++){
                  this.clusters.push({"text":val.clusters[r].title, "value":val.clusters[r].floors});
                }
            }
        },
        typeSeleted(val){
            if(val){
                this.units = [];
                for(var s = 0; s < val.list.length; s++){
                  for(var r = 0; r < val.list[s].units.length; r++){
                    this.units.push({"text":val.list[s].units[r].u, "value":val.list[s].units[r]._id});
                  }
                }
            }
        },
    },
    mounted () {
        this.fetchPlaceDelivery();
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
                unt.push(val[s].types[r]);
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
            this.place._type = this.typeSeleted.value;
            this.place.unit = this.place.unit.value;
            this.place.name = this.place.name && this.place.name.value ? this.place.name.value : this.place.name;
            this.placesSelected.push(this.place);
            this.place = {};
            this.typeSeleted = "";
            this.addPlace = false;
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
            if(this.edit)
              this.customer.status = this.customer.status.value;
            this.customer.delivery_places = this.placesSelected;
            return this.customer;
        },
        processCustomer () {
            this.customer = this.buildCustomer();
            console.log(this.customer);
            if(this.edit){
                this.update(this.customer).then(
                    data => {
                        this.setWarning(data, { root: true }).then(()=>{
                            this.$router.push('/customerDetail/'+this.edit)
                        })
                    },
                    error => {
                })
            }else{
                this.create(this.customer).then(
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
        }
    },
    computed:{
      ...mapState({
        warning: state => state.warning,
        cu: state => state.customer.customer, 
        places: state => state.placeDelivery.places
      }),
      trySend(){
        if(this.edit){
          return false;
        }else{
          if(this.customer && this.customer.id_type && this.customer.id_description && this.customer.email && this.customer.name){
            return false; 
          }
          return true;
        }
      }
    },
  }
</script>

