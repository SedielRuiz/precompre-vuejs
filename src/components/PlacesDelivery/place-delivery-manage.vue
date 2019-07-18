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
                <v-text-field v-model="place.name" prepend-icon="email" name="name" label="Nombre" type="text"></v-text-field>
                <!--v-icon medium style="font-size:25px;">email</v-icon--><div v-if="(edit && place && place.address) || (!edit)"><google-map :title="'Dirección'" :direct="place.address" :coords="place.coords" @setAddress="setAddress"/></div><br>
                <v-combobox v-model="place.country" prepend-icon="email" :items="countries" label="País"></v-combobox>
                <v-combobox v-model="place.city" prepend-icon="email" :items="cities" label="Ciudad"></v-combobox>
                <div v-if="unities">
                  <div v-for="(u, index) in unities">
                    <h2>{{u.text}}</h2><br>
                    <v-alert :value="u.msgError ? true : false" type="error">{{u.msgError}}</v-alert>
                    <div v-if="u.list">
                      <v-chip v-for="(lst, index) in getList(index)" :key="index">{{lst.name}} <v-icon medium @click="removeUnity(index+'_'+lst.name)">close</v-icon></v-chip>
                    </div>
                    <v-text-field v-model="u.quantity" prepend-icon="email" name="address" label="Cantidad" type="number"></v-text-field>
                    <v-text-field v-model="u.unity" prepend-icon="email" name="address" label="Unidad" type="text"></v-text-field>
                    <v-btn small color="primary" @click="addUnity(index, u.value)">Agregar unidad</v-btn>
                  </div><br>
                </div>  
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="processPlace()">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import {mapActions,mapState} from 'vuex';
  import GoogleMap from "@/components/GoogleMap";
  
  export default {
    name: 'place-manage',
    components: {
      GoogleMap
    },
    data () {
      return {
        place: {},
        countries:[
          {text:"Colombia", value:"colombia"}
        ],
        cities:[
          {text:"Bogotá", value:"bogota"}
        ],
        unities:[
          {text:"Apartamento", value:"apto"},
          {text:"Oficina", value:"oficina"},
        ],
        units:[],
        edit:"",
        titleText:""
      }
    },
    watch:{
        pl(val){
          if(val){
            this.place = val;
            console.log("hago esto");
            for(var s = 0; s < this.unities.length; s++){
              for(var r = 0; r < val.unities.length; r++){
                for(var p = 0; p < val.unities[r].list.length; p++){
                  if(this.unities[s].value == val.unities[r]._type){
                    this.units.push({"id":s, "type":val.unities[r]._type, "code":s+"_"+val.unities[r].list[p].unit_name, "name":val.unities[r].list[p].unit_name});
                  }
                }
                this.unities[s].type = val.unities[r]._type;
                this.unities[s].quantity = val.unities[r].qty;
                this.unities[s].list = this.units;
              }
            }
          }
        },
    },
    mounted () {
        this.edit = this.$route.params.id == undefined ? 0 : this.$route.params.id;
        if(this.edit!=""){
            this.titleText="Editar lugar de entrega"
            this.getPlace(this.edit);
        }else{
          this.titleText="Nuevo lugar de entrega"
        }
    },
    methods: {
      ...mapActions({
        create: 'placeDelivery/create',
        update: 'placeDelivery/update',
        getPlace: 'placeDelivery/getPlace', 
        setWarning: 'setWarning',
      }),
      setAddress(obj){
        this.place.address = obj.name;
        this.place.coords = {"lat":obj.position.lat, "long":obj.position.lng}
      },
      getList(idx, type){
        var lst = [];
        for(var s = 0; s < this.units.length; s++){
          if(this.units[s].id == idx)
            lst.push(this.units[s]);
        }
        return lst;
      },
      verifyUnities(type, max){
        var next = true;
        var c = 1;
        for(var s = 0; s < this.units.length; s++){
          if(this.units[s].type == type) c++;
        }
        //console.log("maximo "+max +" tipo "+type+ " cantidad "+c);
        if(c > max)
          next = false;
        return next;
      },
      addUnity(idx, type){
        if(this.verifyUnities(type, this.unities[idx].quantity)){
          this.units.push({"id":idx, "type":type, "code":idx+"_"+this.unities[idx].unity, "name":this.unities[idx].unity});
          this.unities[idx].list = this.units;
          this.unities[idx].msgError = "";
        }
        else{
          this.unities[idx].msgError = "Cantidad maxima de unidades para la unidad "+ this.unities[idx].text;
        }
        this.unities[idx].unity = "";
      },
      removeUnity(code){
        var key = code.split("_");
        var idx = 0;
        for(var s = 0; s < this.units.length; s++){
          if(this.units[s].code == code){
            idx = s;
            break;
          }
        }
        this.units.splice(idx,1);
      },
      buildUnities(){
        var unt = {};
        var unts = [];
        var listUnts = [];
        for(var s = 0; s < this.unities.length; s++){
          unt = {};
          listUnts = []
          unt._type = this.unities[s].value;
          unt.qty = this.unities[s].quantity;
          for(var r = 0; r < this.unities[s].list.length; r++){
            if(this.unities[s].list[r].type == this.unities[s].value)
              listUnts.push({"unit_name":this.unities[s].list[r].name});
          }
          unt.list = listUnts;
          unts.push(unt)
        }
        return unts;
      },
      buildPlace(){
        this.place.unities = this.buildUnities();
        this.place.country = this.place.country.value;
        this.place.city = this.place.city.value;
        return this.place;
      },
      processPlace () {
        this.place = this.buildPlace();
        console.log(this.place);
        if(this.edit){
            this.update(this.place).then(
                data => {
                    this.setWarning(data.message, { root: true }).then(()=>{
                        this.$router.push('/placeDeliveryDetail/'+this.edit)
                    })
                },
                error => {
            })
        }else{
            this.create(this.place).then(
                data => {
                    this.setWarning(data.message, { root: true }).then(()=>{
                        this.$router.push('/placeDeliveryList')
                    })
                },
                error => {
            })
        }
      },
      redirect(page){
        if(page){
            this.$router.push('/placeDeliveryDetail/'+this.edit)
        }else{
            this.$router.push('/placeDeliveryList')
        }
      }
    },
    computed:{
      ...mapState({
        warning: state => state.warning,
        pl: state => state.placeDelivery.place, 
      }),
    },
  }
</script>

