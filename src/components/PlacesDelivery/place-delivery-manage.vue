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
                  <v-combobox v-model="place.country" prepend-icon="email" :items="countries" label="País"></v-combobox>
                </v-flex>
                <v-flex xs12 sm12 md6>
                  <v-combobox v-model="place.city" prepend-icon="email" :items="cities" label="Ciudad"></v-combobox>
                </v-flex>
              </v-layout>
              <v-text-field v-model="place.name" prepend-icon="email" name="name" label="Nombre" type="text"></v-text-field>
              <div v-if="(edit && place && place.address) || (!edit)"><google-map :title="'Dirección'" :direct="place.address" :coords="place.coords" @setAddress="setAddress"/></div><br><!--v-icon medium style="font-size:25px;">email</v-icon-->
              <v-layout row wra>
                <v-flex xs12 sm12 md6>
                </v-flex>
                <v-flex xs12 sm12 md6>
                </v-flex>
              </v-layout>
                <v-layout row wra>
                  <v-flex xs12 sm12 md12>
                    <h2>Composición</h2><hr><br>
                    <!--v-alert :value="u.msgError ? true : false" type="error">{{u.msgError}}</v-alert>
                    <div v-if="u.list">
                      <v-chip v-for="(lst, index) in getList(index)" :key="index">{{lst.name}} <v-icon medium @click="removeUnity(index+'_'+lst.name)">close</v-icon></v-chip>
                    </div-->
                    <v-layout row wra>
                      <v-flex xs12 sm12 md6>
                        <v-text-field v-model="unity.group" prepend-icon="email" name="group" label="Agrupación" type="text"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md6>
                        <v-text-field v-model="unity.sub_group" prepend-icon="email" name="sub_group" label="Sub agrupación" type="text"></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row wra>
                      <v-flex xs12 sm12 md6>
                        <v-text-field v-model="unity.floor" prepend-icon="email" name="floor" label="Piso" type="text"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md6>
                        <v-text-field v-model="unity.quantity" prepend-icon="email" name="address" label="Cantidad" type="number"></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row wra>
                      <v-spacer></v-spacer>
                      <v-btn medium color="primary" :disabled="!unity.floor || !unity.quantity ? true :false" @click="addUnity()">Agregar unidades</v-btn><br><br>
                      <v-btn medium color="primary" :disabled="units.length > 0 ? false : true" @click="units = []">Limpiar</v-btn><br><br>
                    </v-layout>
                    <div v-if="units.length > 0">
                      <h2>Unidades</h2><hr><br>
                      <v-layout row wra>
                        <v-flex xs12 sm12 md4>
                          <label style="font-size:20px;"> Unidad </label>
                        </v-flex>
                        <v-flex xs12 sm12 md3>
                          <label style="font-size:20px;"> Tipo </label>
                        </v-flex>
                        <v-flex xs12 sm12 md3>
                          <label style="font-size:20px;"> Observaciones</label>
                        </v-flex>
                        <v-flex xs12 sm12 md2>
                          <label style="font-size:20px;"> Disponible</label>
                        </v-flex>
                      </v-layout>
                      <v-layout row wra v-for="(u, index) in units" :key="index">
                        <v-flex xs12 sm12 md4>
                          <v-text-field v-model="u.unity" prepend-icon="email" name="address" label="Unidad" type="text"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md3>
                          <v-select v-model="u.type" :items="unities" prepend-icon="featured_play_list" label="Tipo"></v-select>
                        </v-flex>
                        <v-flex xs12 sm12 md3>
                          <v-text-field v-model="u.observations" prepend-icon="email" name="observations" label="Observaciones" type="text"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md2>
                          <v-checkbox align-center value input-value="true" v-model="u.available == null || u.available == undefined ? u.available = true : u.available"></v-checkbox>
                        </v-flex>
                      </v-layout>
                    </div>
                  </v-flex>
                </v-layout><br> 
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" :disabled="trySend" style="width: 100%;" @click="processPlace()">Guardar</v-btn>
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
        unity:{},
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
            for(var s = 0; s < val.unities.length; s++){
              if(val.unities[s].list.length > 0){
                for(var r = 0; r < val.unities[s].list.length; r++){
                  this.units.push({"type":val.unities[s]._type, "observations":val.unities[s].list[r].observations, "unity":val.unities[s].list[r].unit_name, "available":true});
                }
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
      this.place.country = this.countries.find(element=>{return element.value == "colombia"});
      this.place.city = this.cities.find(element=>{return element.value == "bogota"});
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
      addUnity(){
        var unit = "";
        var group = this.unity.group ? this.unity.group + " - " : "";
        var sub_group =  this.unity.sub_group ? this.unity.sub_group + " - " : "";
        for(var s = 1; s <= this.unity.quantity; s++){
          unit = group + sub_group + this.unity.floor+(s < 10 ? "0"+s : s);
          this.units.push({"type":this.unities[0].value, "unity":unit, "available":true});
        }
        this.unity.group = "";
        this.unity.sub_group = "";
        this.unity.quantity = "";
        this.unity.floor = "";
      },
      removeUnity(code){
        var key = code.split("_");
        code = key[0]+"_"+key[1].split(" ").join("");
        var idx = 0;
        for(var s = 0; s < this.units.length; s++){
          if(this.units[s].code == code){
            idx = s;
            break;
          }
        }
        this.units.splice(idx,1);
      },
      typeCompos(type){
        var lst = [];
        var obj = {};
        obj._type = type;
        for(var r = 0; r < this.units.length; r++){
          if(this.units[r].type == type && this.units[r].available == true){
            lst.push({unit_name:this.units[r].unity, observations:this.units[r].observations});
          }
        }
        obj.qty = lst.length;
        obj.list = lst;
        return obj;
      },
      buildUnities(){
        var unts = [];
        var compos = {};
        if(this.units.length > 0){
          compos = this.typeCompos("oficina");
          if(compos){unts.push(compos);}

          compos = this.typeCompos("apto");
          if(compos){unts.push(compos);}
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
        if(this.edit){
            this.update(this.place).then(
                data => {
                    this.setWarning(data, { root: true }).then(()=>{
                        this.$router.push('/placeDeliveryDetail/'+this.edit)
                    })
                },
                error => {
            })
        }else{
            this.create(this.place).then(
                data => {
                    this.setWarning(data, { root: true }).then(()=>{
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
      trySend(){
        console.log(this.place);
        if(this.place && this.place.name != "" && this.place.address != ""){
          return false; 
        }
        return true;
      }
    },
  }
</script>

