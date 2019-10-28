<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md10>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-icon large @click="redirect(false)">keyboard_backspace</v-icon>
            <v-toolbar-title>Detalle de lugar de entrega</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="success" @click="redirect(true)">Editar</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-layout row wrap>
                <v-flex xs12 sm12 md6>
                  <v-text-field readonly v-model="place.country" prepend-icon="email" name="country" label="País" type="text"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md6>
                  <v-text-field readonly v-model="place.city" prepend-icon="email" name="city" label="ciudad" type="text"></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs12 sm12 md6>
                  <v-text-field readonly v-model="place.name" prepend-icon="email" name="name" label="Nombre" type="text"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md6>
                  <v-text-field readonly v-model="place.welcome_code" prepend-icon="email" name="welcome_code" label="Código de bienvenida" type="text"></v-text-field>
                </v-flex>
              </v-layout>
              <v-select readonly v-model="place.input_type" prepend-icon="email" :items="locationTypes" label="Tipo de localización"></v-select>
              <div v-if="place.input_type == 'manual'">
                <v-text-field readonly v-model="place.address" prepend-icon="email" name="address" label="Dirección" type="text"></v-text-field>
                <v-layout row wrap>
                  <v-flex xs12 sm12 md6>
                    <v-text-field readonly v-model="place.coords.lat" prepend-icon="email" name="lat" label="Latitud" type="text"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md6>
                    <v-text-field readonly v-model="place.coords.long" prepend-icon="email" name="long" label="Longitud" type="text"></v-text-field>
                  </v-flex>
                </v-layout>
              </div>
              <div v-else-if="place.input_type == 'google'">
                <v-text-field readonly v-model="place.address" prepend-icon="email" name="address" label="Dirección" type="text"></v-text-field>
                <gmap-map v-if="place.coords"
                    :center="center" :zoom="12"
                    style="width:100%;  height: 400px;">
                    <gmap-marker
                        :position="place.coords"
                        @click="center=place.coords">
                    </gmap-marker>
                </gmap-map><br>
              </div>
              <h2>Administración</h2><hr><br>
              <v-layout row wrap>
                <v-flex xs12 sm12 md6>
                  <v-text-field readonly v-model="place.administration.name" prepend-icon="email" name="name" label="Nombre del administrador" type="text"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md6>
                  <v-text-field readonly v-model="place.administration.phone" prepend-icon="email" name="phone" label="Teléfono" type="number"></v-text-field>
                </v-flex>
              </v-layout><br>
              <div>
                <observations :routeFetch="'delivery_places'" :routeEdit="'edit_delivery_place'" :obs="place.observations && place.observations.length > 0 ? place.observations : []" :id="this.$route.params.id == undefined ? 0 : this.$route.params.id" :last="false"></observations>
              </div>
              <h2>Unidades</h2><hr><br><br>
              <div v-if="unitsV.length > 0">
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
                              <v-flex xs12 sm12 md6>
                                <v-text-field readonly v-model="n.unity" prepend-icon="email" name="address" label="Unidad" type="text"></v-text-field>
                              </v-flex>
                              <v-flex xs12 sm12 md6>
                                <v-text-field readonly v-model="n.observations" prepend-icon="email" name="observations" label="Observaciones" type="text"></v-text-field>
                              </v-flex>
                            </v-layout>

                          </div>
                        </v-container>
                      </v-card><br><br>
                    </div>
                    
                  </div>  
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
<style>
  .scroll{
    height: 305px;
    overflow:auto;
  }
</style>
<script>
  import {mapActions,mapState} from 'vuex';
  import Observations from "@/components/Observations";
  
  export default {
    name: 'delivery-place-manage',
    components:{
      Observations,
    },
    data () {
      return {
        center: {},
        place: {},
        unities:[],
        unitsV:[],
        edit:"",
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
            if(!this.place.administration)
              this.place.administration = {name:"", phone:""};
            if(this.place.coords)
              this.place.coords = {"lat":Number(this.place.coords.lat), "lng":Number(this.place.coords.long)};
            this.center = this.place.coords;
            this.unities = val.clusters;
            this.formatUnits();
          }
        },
    },
    mounted () {
        this.edit = this.$route.params.id == undefined ? 0 : this.$route.params.id;
        //this.place.administration = {name:"", phone:""};
        if(this.edit!=""){
            this.getPlace(this.edit);
        }
    },
    methods: {
      ...mapActions({
        getPlace: 'placeDelivery/getPlace', 
        setWarning: 'setWarning',
      }),
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
                units.push({observations:array.floors[r].types[g].units[j].observations, unity:unit, state:true});
              }
              types = {"type":type , "units": units};

            }
          }
        }
        return types;
      },
      formatUnits(){
        this.unitsV = [];
        var tps = [];
        var type = "";
        for(var s = 0; s < this.unities.length; s++){
          tps = [];
          type = this.formatFloors(this.unities[s], 'apto');
          if(type != ""){
            tps.push(type);
          }
          type = this.formatFloors(this.unities[s], 'oficina');
          if(type != ""){
            tps.push(type);
          }

          if(tps.length > 0){
            this.unitsV.push({"name":this.unities[s].title.value ? this.unities[s].title.value : this.unities[s].title, "types":tps});
          }
        }
        console.log(this.unitsV);
      },
      redirect(page){
        if(page){
            this.$router.push('/placeDeliveryManage/'+this.edit)
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

