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
                  <v-combobox v-model="customer.id_type" prepend-icon="account_box" :items="typesIdentification" label="Tipo de identificación"></v-combobox>
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
                    <v-combobox v-model="phone.type" :items="typesPhone" prepend-icon="call" label="Tipo de número"></v-combobox>
                    <v-switch v-model="phones.length == 0 ? phone.main = true : phone.main" :label="'Principal'"></v-switch>
                    <label>Recuerde que si selecciona este como principal se anularan los anteriores como principal.</label>
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
                    <v-combobox v-if="typesPlaces.length > 0" v-model="typeSeleted" :items="typesPlaces" prepend-icon="list_alt" label="Tipo de domicilio"></v-combobox>
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
            this.customer.id_type = this.typesIdentification.find(element=>{return element.value == val.id_type });
            this.phones = val.telephones;
            this.placesSelected = val.delivery_places;
          }
        },
        places(val){
            if(val){
                for(var s = 0; s < val.length; s++){
                    this.placesDelivery.push({"text":val[s].name, "value":val[s]._id});
                }
            }
        },
        placeDelivery(val){
            if(val){
                val = val.value;
                this.typesPlaces = [];
                for(var s = 0; s < this.places.length; s++){
                    if(this.places[s]._id == val){
                        for(var r = 0; r < this.places[s].unities.length; r++){
                            this.typesPlaces.push({"text":this.places[s].unities[r]._type, "value":this.places[s].unities[r]._type, "list":this.places[s].unities[r].list});
                        }
                    }
                }
            }
        },
        typeSeleted(val){
            if(val){
                console.log(val);
                this.units = [];
                for(var s = 0; s < val.list.length; s++){
                    this.units.push({"text":val.list[s].unit_name, "value":val.list[s]._id});
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
        generatePassword(longitud){
          var long=parseInt(longitud);
            var caracteres = "abcdefghijkmnp?qrtuvwx&yzABCDEF/GHI+JKLMNPQRTUVW.X@YZ_2346789";
            var contraseña = "";
            for (var i=0; i<long; i++) contraseña += caracteres.charAt(Math.floor(Math.random()*caracteres.length));
            return contraseña;
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
            this.customer.password = "admin123"//this.generatePassword(8);
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
        if(this.customer && this.customer.id_type && this.customer.id_description && this.customer.email && this.customer.name){
          return false; 
        }
        return true;
      }
    },
  }
</script>

