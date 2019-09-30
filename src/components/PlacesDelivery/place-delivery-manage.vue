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
                  <v-combobox v-model="place.country" prepend-icon="email" :items="countries" label="País"></v-combobox>
                </v-flex>
                <v-flex xs12 sm12 md6>
                  <v-combobox v-model="place.city" prepend-icon="email" :items="cities" label="Ciudad"></v-combobox>
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs12 sm12 md6>
                  <v-text-field v-model="place.name" prepend-icon="email" name="name" label="Nombre" type="text"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md6>
                  <v-text-field v-if="edit" v-model="place.welcome_code" prepend-icon="email" name="welcome_code" label="Código de bienvenida" type="text"></v-text-field>
                </v-flex>
              </v-layout>
              <v-select v-model="place.input_type" prepend-icon="email" :items="locationTypes" label="Tipo de localización"></v-select>
              <div v-if="place.input_type == 'manual'">
                <v-text-field v-model="place.address" prepend-icon="email" name="address" label="Dirección" type="text"></v-text-field>
                <v-layout row wrap>
                  <v-flex xs12 sm12 md6>
                    <v-text-field v-model="place.coords.lat" prepend-icon="email" name="lat" label="Latitud" type="text"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md6>
                    <v-text-field v-model="place.coords.long" prepend-icon="email" name="long" label="Longitud" type="text"></v-text-field>
                  </v-flex>
                </v-layout>
              </div>
              <div v-else-if="place.input_type == 'google'">
                <div v-if="(edit && place && place.address) || (!edit)"><google-map :title="'Dirección'" :direct="place.address" :coords="place.coords" @setAddress="setAddress"/></div><br><!--v-icon medium style="font-size:25px;">email</v-icon-->
              </div>
              <h2>Administración</h2><hr><br>
              <v-layout row wrap>
                <v-flex xs12 sm12 md6>
                  <v-text-field v-model="place.administration.name" prepend-icon="email" name="name" label="Nombre del administrador" type="text"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md6>
                  <v-text-field v-model="place.administration.phone" prepend-icon="email" name="phone" label="Teléfono" type="number"></v-text-field>
                </v-flex>
              </v-layout><br>
                <v-layout row wrap>
                  <v-flex xs12 sm12 md12>
                    <h2>Composición</h2><hr><br>
                    <!--v-alert :value="u.msgError ? true : false" type="error">{{u.msgError}}</v-alert>
                    <div v-if="u.list">
                      <v-chip v-for="(lst, index) in getList(index)" :key="index">{{lst.name}} <v-icon medium @click="removeUnity(index+'_'+lst.name)">close</v-icon></v-chip>
                    </div-->
                    <v-layout row wrap>
                      <v-flex xs12 sm12 md6>
                        <v-combobox v-model="group" prepend-icon="email" name="group" :items="inside" label="Agrupación Ej(Torre)"></v-combobox>
                      </v-flex>
                      <v-flex xs12 sm12 md6>
                        <v-combobox v-model="unity.type" prepend-icon="email" name="group" :items="unities" label="Tipo"></v-combobox>
                      </v-flex>
                    </v-layout>
                    <h3>Masivo</h3><hr>
                    <v-layout row wrap>
                      <v-flex xs12 sm12 md4>
                        <v-combobox v-model="floor" prepend-icon="email" name="floor" :items="floors" label="Pisos"></v-combobox>
                      </v-flex>
                      <v-flex xs12 sm12 md4>
                        <v-text-field v-model="unity.quantity" prepend-icon="email" name="address" label="Cantidad" type="number"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md4>
                        <v-text-field v-model="unity.start" prepend-icon="email" name="start" label="Inicio (opcional)" type="number"></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                      <v-spacer></v-spacer>
                      <v-btn medium color="primary" @click="addUnity('m')">Agregar unidades</v-btn><br><br>
                      <v-btn medium color="primary" :disabled="units.length > 0 ? false : true" @click="unitsV = []; units = [];">Limpiar</v-btn><br><br>
                    </v-layout><br>
                    <h3>Unidades por piso</h3><hr>
                    <v-layout row wrap>
                      <v-flex xs12 sm12 md6>
                        <v-combobox v-model="unity.floor_unit" prepend-icon="email" name="floor" :items="floors" label="Piso"></v-combobox>
                      </v-flex>
                      <v-flex xs12 sm12 md6>
                        <v-text-field v-model="unity.quantity" prepend-icon="email" name="address" label="Cantidad" type="number"></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                      <v-spacer></v-spacer>
                      <v-btn medium color="primary" :disabled="unity && unity.floor_unit ? false : true" @click="addUnity('s')">Agregar unidades</v-btn><br><br>
                    </v-layout><br>
                    <h3>Individual</h3><hr>
                    <v-layout row wrap>
                      <v-flex xs12 sm12 md6>
                        <v-combobox v-model="unity.floor_only" prepend-icon="email" name="floor" :items="floors" label="Piso"></v-combobox>
                      </v-flex>
                      <v-flex xs12 sm12 md6>
                        <v-text-field v-model="unity.unt" prepend-icon="email" name="address" label="Unidad" type="text"></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                      <v-spacer></v-spacer>
                      <v-btn medium color="primary":disabled="unity && unity.floor_only  && unity.unt? false : true" @click="addUnity('r')">Agregar unidad</v-btn><br><br>
                    </v-layout>
                    
                    <div v-if="unitsV.length > 0">
                      <h2>Unidades</h2><hr><br><br>
                      <div v-for="(u, index) in unitsV" :key="index">
                        <v-card class="elevation-8 scroll">
                          <v-container>
                            <v-layout row wrap>
                              <v-flex xs12 sm12 md4>
                                <label style="font-size:20px;"> Unidad </label>
                              </v-flex>
                              <v-flex xs12 sm12 md3>
                                <label style="font-size:20px;"> Observaciones</label>
                              </v-flex>
                              <v-flex xs12 sm12 md2>
                                <label style="font-size:20px;"> Disponible</label>
                              </v-flex>
                            </v-layout>
                            <div row wrap v-for="(t, index) in u.types" :key="index">

                              <h3>{{u.name}} - {{t.type}}</h3><br>

                              <v-layout row wrap v-for="(n, index) in t.units" :key="index">
                                <v-flex xs12 sm12 md4>
                                  <v-text-field v-model="n.unity" prepend-icon="email" name="address" label="Unidad" type="text"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md3>
                                  <v-text-field v-model="n.observations" prepend-icon="email" name="observations" label="Observaciones" type="text"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md2>
                                  <v-checkbox align-center value input-value="true" v-model="n.state"></v-checkbox>
                                </v-flex>
                              </v-layout>

                            </div>
                          </v-container>
                        </v-card><br><br>
                      </div>
                      
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
      GoogleMap,
    },
    data () {
      return {
        unity:{},
        place: {},
        inside:[],
        floors:[],
        floor:"",
        group:"",
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
        unitsV:[],
        edit:"",
        titleText:"",
        locationTypes:[
          {text:"Manual", value:"manual"},
          {text:"Google", value:"google"},
        ],
      }
    },
    watch:{
        pl(val){
          if(val){
            this.place = val;
            if(!this.place.administration){
              this.place.administration = {name:"", phone:""};
            }
            if(val.clusters){
              this.units = val.clusters;
              this.formatUnits();
            }
            /*for(var s = 0; s < val.unities.length; s++){
              if(val.unities[s].list.length > 0){
                for(var r = 0; r < val.unities[s].list.length; r++){
                  this.units.push({"type":val.unities[s]._type, "observations":val.unities[s].list[r].observations, "unity":val.unities[s].list[r].unit_name, "available":true});
                }
              }
            }*/
          }
        },
        group(val){
          if(val){
            var int = this.units.find(element=>{return element.title == val.value ? val.value : val });
            if(int){
              this.floors = [];
              for(var s = 0; s <= int.floors; s++){
                this.floors.push({text:int.floors[s].number, value:int.floors[s].number});
              }
            }
          }
        },
    },
    mounted () {
      this.edit = this.$route.params.id == undefined ? 0 : this.$route.params.id;
      this.place.coords = {lat:"", long:""};
      this.place.administration = {name:"", phone:""};
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
        console.log(obj);
        this.place.address = obj.name;
        this.place.coords = {"lat":obj.position.lat, "long":obj.position.lng}
      },
      addUnity(opc){
        var unit = "";
        var units = [];
        var group = this.group && this.group.value ? this.group.value : this.group;
        group = group ? group : this.place.name;
        var idx = "";
        for(var s = 0; s < this.units.length; s++){
          var tl = this.units[s].title && this.units[s].title.value ? this.units[s].title.value : this.units[s].title;
          if(tl == group){
            idx = s;
            break;
          }
        }
        //Si no existe la agrupacion
        if(idx === ""){
          if(opc == "m"){
            this.inside.push({text:group, value:group});
            var floorss = [];
            //Lleno las unidades
            for(var p = 1; p <= this.floor; p++){
              units = [];
              var n = this.unity && this.unity.start ? this.unity.start : 1;
              var j = 1;
              for(var s = 1; s <= this.unity.quantity; s++){
                j = Number(s) + Number(n) - 1;
                unit = p+""+( j < 10 ? "0"+j : j);
                units.push({u: unit,observations:"",state:true});
              }
              floorss.push({"number":p, "types":[ {"_type":this.unity.type.value, "units": units} ] });
            }
            //cargo el nuevo interior
            this.units.push({
              title:group, 
              floors:floorss
            });
            this.floor = "";
            this.unity.start = "";
          }else{
            var flr = "";
            if(opc == "s"){
              flr = this.unity.floor_unit;
            }else if(opc == "r"){
              flr = this.unity.floor_only;
            }

            //Lleno las unidades
            if(opc == "r"){
              this.unity.quantity = 1;
            }
            for(var s = 1; s <= this.unity.quantity; s++){
              unit = flr+ (opc == "r" ? this.unity.unt : (s < 10 ? "0"+s : s));
              units.push({u: unit,observations:"",state:true});
            }
            //cargo el nuevo interior
            this.units.push({
              title:group, 
              floors:[{
                number:flr, 
                types:[
                  {
                    _type: this.unity.type.value,
                    units:units
                  }
                ],
              }]
            });
            this.floor = "";
          }


        }else{
          //Si existe la agrupacion
          if(opc == "m"){
            var flr = -1;
            //Piso existente
            for(var p = 1; p <= this.floor; p++){
              for(var r = 0; r < this.units[idx].floors.length; r++){
                if(this.units[idx].floors[r].number == p){
                  flr = r;
                  break;
                }
              }

              //Lleno las unidades
              units = [];
              var n = this.unity && this.unity.start ? this.unity.start : 1;
              var j = 1;
              for(var s; s <= this.unity.quantity; s++){
                j = Number(s) + Number(n) - 1;
                unit = p +""+( j < 10 ? "0"+j : j );
                units.push({u: unit,observations:"",state:true});
              }

              //Si el piso existe 
              var type = -1;
              var exs = true;
              if(flr >= 0){
                //Concateno las que ya tenia units por tipo
                for(var g = 0; g < this.units[idx].floors[flr].types.length; g++){
                  if(this.units[idx].floors[flr].types[g]._type == this.unity.type.value){ 
                    units = units.concat(this.units[idx].floors[flr].types[g].units);
                    type = g;
                    break;
                  }
                }
                if(type < 0){
                  exs = false;
                }
                //Objeto con nueva unidades y nuevo tipo
                if(exs){
                  //Actualizo las unidades del piso
                  this.units[idx].floors[flr].types[type].units = units;
                }else{
                  var obj = {
                    _type: this.unity.type.value,
                    units:units,
                  };
                  var lst = this.units[idx].floors[flr].types;
                  lst.push(obj);
                  this.units[idx].floors[flr].types = lst;
                }

              }else{
                //Si el piso no existe
                units = [];
                for(var s = 1; s <= this.unity.quantity; s++){
                  unit = p+(s < 10 ? "0"+s : s);
                  units.push({u: unit,observations:"",state:true});
                }

                var floor = {
                  number:p, 
                  types:[{
                      _type: this.unity.type.value,
                      units:units
                    }],
                };
                var flrs = this.units[idx].floors;
                flrs.push(floor);
                this.units[idx].floors = flrs;
              }
              
            }
            this.unity.start = "";
          }else{
            var flr = -1;
            units = [];
            //Piso existente
            for(var r = 0; r < this.units[idx].floors.length; r++){
              if(this.units[idx].floors[r].number == (opc == "r" ? this.unity.floor_only : this.floor_unit )){
                flr = r;
                break;
              }
            }

            //Lleno las unidades
            if(opc == "s"){
              for(var s = 1; s <= this.unity.quantity; s++){
                unit = this.unity.floor_unit+(s < 10 ? "0"+s : s);
                units.push({u: unit, observations:"", state:true});
              }
            }

            //Si el piso existe 
            var type = -1;
            var exs = true;
            if(flr >= 0){
              //Concateno las que ya tenia units por tipo
              for(var g = 0; g < this.units[idx].floors[flr].types.length; g++){
                if(this.units[idx].floors[flr].types[g]._type == this.unity.type.value){ 
                  units = units.concat(this.units[idx].floors[flr].types[g].units);
                  type = g;
                  break;
                }
              }
              if(type < 0){
                exs = false;
              }
              //Objeto con nueva unidades y nuevo tipo
              if(exs){
                //Re ordeno nuemor de unidades
                if(opc == "s"){
                  var lst = [];
                  for(var g = 1; g <= units.length; g++){
                    lst.push(this.unity.floor_unit+(g < 10 ? "0"+g : g));
                  }
                  units = lst;
                }
                //Actualizo las unidades del piso
                if(opc == "r"){
                  units.push({u: this.unity.unt, observations:"", state:true});
                }
                this.units[idx].floors[flr].types[type].units = units;
              }else{
                var obj = {
                  _type: this.unity.type.value,
                  units:units,
                };
                var lst = this.units[idx].floors[flr].types;
                lst.push(obj);
                this.units[idx].floors[flr].types = lst;
              }
            }else{
              if(opc == "r"){
                units.push({u: this.unity.unt, observations:"", state:true});
              }
              //Si el piso no existe
              var pss = "";
              if(opc == "s"){
                pss = this.unity.floor_unit;
              }else if(opc == "m"){
                pss = this.floor
              }else if(opc == "r"){
                pss = this.unity.floor_only;
              }
              var floor = {
                number:pss, 
                types:[{
                    _type: this.unity.type.value,
                    units:units
                  }],
              }
              var flrs = this.units[idx].floors;
              flrs.push(floor);
              this.units[idx].floors = flrs;
            }
          }

        }
        if(opc == "r"){
          this.unity.unt = "";
          this.unity.floor_only = "";
        }else if(opc == "s"){
          this.unity.floor_unit = "";
          this.unity.quantity = "";
        }else{
          this.floor = "";
        }
        this.units.push();
        this.formatUnits();
        console.log(this.units);
      },
      formatUnits(){
        this.unitsV = [];
        var tps = [];
        var type = "";
        for(var s = 0; s < this.units.length; s++){
          var name = this.units[s].title.value ? this.units[s].title.value : this.units[s].title;
          this.inside.push({text:name, value:name});
          tps = [];
          type = this.formatFloors(this.units[s], 'apto');
          if(type != ""){
            tps.push(type);
          }
          type = this.formatFloors(this.units[s], 'oficina');
          if(type != ""){
            tps.push(type);
          }

          if(tps.length > 0){
            this.unitsV.push({"name":name, "types":tps});
          }
        }
        this.unitsV.push();
        console.log(this.unitsV);
      },
      formatFloors(array, type){
        var types = "";
        var unit = "";
        var units = [];
        for(var r = 0; r < array.floors.length; r++){
          for(var g = 0; g < array.floors[r].types.length; g++){
            if(array.floors[r].types[g]._type == type){

              var type = array.floors[r].types[g]._type;
              for(var j = 0; j < array.floors[r].types[g].units.length; j++){
                unit = array.floors[r].types[g].units[j].u;
                units.push({observations:array.floors[r].types[g].units[j].observations, unity_base:unit, unity:unit, state:true, type:array.floors[r].types[g]._type, floor:array.floors[r]});
              }
              types = {"type":type , "units": units};

            }
          }
        }
        return types;
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
      replaceUnities(unit1, unit2, type){
        if(unit1){
          for(var r = 0; r < unit1.length; r++){
            for(var g = 0; g < unit2.length; g++){
              if(unit1[r] && unit1[r].u == unit2[g].unity_base && unit2[g].type == type){
                if(!unit2[g].state){
                  unit1.splice(r, 1);
                }else{
                  unit1[r].observations = unit2[g].observations;
                  unit1[r].u = unit2[g].unity;
                }
              }
            }
          }
        }
        return unit1
      },
      typeCompos(type){
        var lst = [];
        var obj = {};
        obj._type = type;
        for(var r = 0; r < this.units.length; r++){
          for(var g = 0; g < this.units[r].floors.length; g++){
            for(var j = 0; j < this.units[r].floors[g].types.length; j++){

              for(var s = 0; s < this.unitsV.length; s++){

                if(this.unitsV[s].name == this.units[r].title){
                  for(var p = 0; p < this.unitsV[s].types.length; p++){

                    if( this.units[r].floors[g].types[j]._type == type && this.unitsV[s].types[p].type == type ){
                      this.units[r].floors[g].types[j].units = this.replaceUnities(this.units[r].floors[g].types[j].units, this.unitsV[s].types[p].units, type);
                    }

                  }
                }

              }


            }
          }
        }
      },
      buildUnities(){
        var unts = [];
        var compos = {};
        if(this.units.length > 0){
          this.typeCompos("oficina");
          if(compos){unts.push(compos);}

          this.typeCompos("apto");
          if(compos){unts.push(compos);}
        }
        this.units.push();
      },
      buildPlace(){
        this.buildUnities();
          console.log(this.units);
        this.place.clusters = this.units;
        this.place.country = this.place.country.value;
        this.place.city = this.place.city.value;
        if(this.edit)
          this.place.welcome_code = this.place.welcome_code.toLowerCase().split(" ").join("_");
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
        if(this.place && this.place.name != "" && this.place.address != ""){
          return false; 
        }
        return true;
      }
    },
  }
</script>

