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
                <v-combobox v-model="customer.id_type" prepend-icon="email" :items="typesIdentification" label="Tipo de identificación"></v-combobox>
                <v-text-field v-model="customer.id_description" prepend-icon="email" name="id_description" label="Número de identificación" type="text"></v-text-field>
                <v-text-field v-model="customer.name" prepend-icon="email" name="name" label="Nombres" type="text"></v-text-field>
                <v-text-field v-model="customer.last_name" prepend-icon="email" name="last_mame" label="Apellidos" type="text"></v-text-field>
                <v-text-field v-model="customer.email" prepend-icon="email" name="email" label="Correo" type="text"></v-text-field>
                <v-combobox v-if="edit!=''" v-model="customer.status == 'enable' ? 'Activo' : 'Inactivo'" :items="status" prepend-icon="email" label="Estado"></v-combobox>
                <v-text-field v-if="edit==''" v-model="customer.password" prepend-icon="email" name="password" label="Contraseña" type="password"></v-text-field>
                <h2>Teléfonos <v-icon medium @click="addNumber ? addNumber = false : addNumber = true">event</v-icon></h2><br>
                <div v-if="phones.length > 0">
                  <v-chip v-for="(p, index) in phones" :key="index">{{p.number}} <v-icon medium @click="removePhone(index)">close</v-icon></v-chip>
                </div>
                <br>
                <div v-if="addNumber" class="row col-md-8">
                  <v-card style="height: 100%;width: 84%; padding: 31px;">
                    <!--TELEFONOS-->
                    <label style="font-size: 18px;">Nuevo teléfono</label><hr>
                    <v-text-field v-model="phone.title" prepend-icon="title" name="title" label="Titulo" type="text"></v-text-field>
                    <v-text-field v-model="phone.number" prepend-icon="email" name="number" label="Número" type="number"></v-text-field>
                    <v-combobox v-model="phone.type" :items="typesPhone" prepend-icon="email" label="Tipo de número"></v-combobox>
                    <v-text-field v-model="phone.extension" prepend-icon="extension" name="extension" label="Extensión" type="text"></v-text-field>
                    <v-text-field v-model="phone.code" prepend-icon="code" name="code" label="Código postal" type="text"></v-text-field>
                    <v-switch v-model="phone.main" :label="'Principal'"></v-switch>
                    <v-btn color="primary" @click="addPhone()">Agregar</v-btn>
                    <!--TELEFONOS-->
                  </v-card><br>
                </div>
                <h2>Lugares de entrega <v-icon medium @click="addPlace ? addPlace = false : addPlace = true">event</v-icon></h2><br>
                <div v-if="placesSelected.length > 0">
                  <v-chip v-for="(p, index) in placesSelected" :key="index">{{p.name}} <v-icon medium @click="removePlace(index)">close</v-icon></v-chip>
                </div>
                <div v-if="addPlace" class="row col-md-8">
                  <v-card style="height: 100%;width: 84%; padding: 31px;">
                    <label style="font-size: 18px;">Nuevo lugar de entrega</label><hr>
                    <!--LUGARES DE ENTREGA-->
                    <v-combobox v-model="place.name" :items="suggestions" prepend-icon="email" label="Nombre"></v-combobox>
                    <v-combobox v-model="placeDelivery" :items="placesDelivery" prepend-icon="email" label="Lugar de entrega"></v-combobox>
                    <v-combobox v-if="typesPlaces.length > 0" v-model="typeSeleted" :items="typesPlaces" prepend-icon="email" label="Tipo de domicilio"></v-combobox>
                    <v-combobox v-if="units.length > 0" v-model="place.unit" :items="units" prepend-icon="email" label="Unidad"></v-combobox>
                    <v-btn color="primary" @click="selectedPlace()">Agregar</v-btn>
                    <!--LUGARES DE ENTREGA-->
                  </v-card><br>
                </div>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="processCustomer()">Guardar</v-btn>
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
        placesSelected:[],
        placeDelivery:"",
        typeSeleted:"",
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
        ],
        edit:"",
        titleText:""
      }
    },
    watch:{
        cu(val){
          if(val){
            this.customer = val;
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
            this.phones.push(this.phone);
            this.phone = {};
            this.addNumber = false;
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
                        this.setWarning(data.message, { root: true }).then(()=>{
                            this.$router.push('/customerDetail/'+this.edit)
                        })
                    },
                    error => {
                })
            }else{
                this.create(this.customer).then(
                    data => {
                        this.setWarning(data.message, { root: true }).then(()=>{
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
    },
  }
</script>

