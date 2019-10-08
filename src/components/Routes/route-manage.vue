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
                <v-text-field v-model="route.name" prepend-icon="email" name="name" label="Nombre" type="text"></v-text-field>
                <v-text-field v-model="route.sector" prepend-icon="library_books" name="sector" label="Sector" type="text"></v-text-field>
                <v-layout row wrap>
                    <v-flex xs12 sm12 md10>
                        <v-text-field v-model="schedule" prepend-icon="email" name="schedule" label="Horario" type="text"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md2>
                        <v-icon medium @click="addArray('h')">add</v-icon>
                    </v-flex>
                </v-layout>
                <v-chip v-for="(h, index) in schedules" :key="index">{{h}} <v-icon medium @click="removeArray('h', index)">close</v-icon></v-chip>
                <h2>Edificios <v-icon medium @click="addBuilding ? addBuilding = false : addBuilding = true">add</v-icon></h2><br>
                <div v-if="buildingsSelected.length > 0">
                    <v-chip v-for="(p, index) in buildingsSelected" :key="index">{{p.text}} <v-icon medium @click="removeArray('p', index)">close</v-icon></v-chip>
                </div>
                <br>
                <div v-if="addBuilding" class="row col-md-8">
                    <v-card style="height: 100%;width: 84%; padding: 31px;">
                        <!--EDIFICIOS-->
                        <v-combobox v-model="building" prepend-icon="account_box" :items="buildings" label="Edificio"></v-combobox>
                        <v-btn color="primary" :disabled="building ? false : true" @click="addArray('p')">Agregar</v-btn>
                    </v-card><br>
                </div>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" :disabled="trySend" style="width: 100%;" @click="processRoute()">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import {mapActions,mapState} from 'vuex';
  
  export default {
    
    name: 'route-manage',
    data () {
      return {
        route: {},
        building:"",
        addBuilding:false,
        buildings: [],
        buildingsSelected: [],
        schedule:"",
        schedules:[],
        edit:"",
        titleText:""
      }
    },
    watch:{
        sto(val){
          if(val){
            this.route = val;
            this.schedules = val.schedule;
            for(var s = 0; s < val.delivery_places.length; s++){
                this.buildingsSelected.push({text:this.buildings.name, value:this.buildings._id});
            }
          }
        },
        places(val){
            if(val){
                for(var s = 0; s < val.length; s++){
                    this.buildings.push({text:val[s].name, value:val[s]._id});
                }
            }
        }
    },
    mounted () {
        this.fetchPlaceDelivery({page_size:-1});
        this.edit = this.$route.params.id == undefined ? 0 : this.$route.params.id;
        if(this.edit!=""){
            this.titleText="Editar ruta";
            this.getRoute(this.edit);
        }else{
          this.titleText="Nueva ruta";
        }
    },
    methods: {
        ...mapActions({
            create: 'route/create',
            update: 'route/update',
            getRoute: 'route/getRoute', 
            fetchPlaceDelivery: 'placeDelivery/fetchPlaces',
            setWarning: 'setWarning',
        }),
        addArray(opc){
            switch(opc){
                case "p":
                    this.buildingsSelected.push(this.building);
                    this.building = "";
                    break;
                case "h":
                    this.schedules.push(this.schedule);
                    this.schedule = "";
                    break;
            }
        },
        removeArray(opc, idx){
            switch(opc){
                case "p":
                    this.buildingsSelected.splice(idx, 1);
                    break;
                case "h":
                    this.schedules.splice(idx, 1);
                    break;
            }
        },
        formatBuildings(){
            var lst = []
            for(var s = 0; s < this.buildingsSelected.length; s++){
                lst.push(this.buildingsSelected[s].value);
            }
            return lst;
        },
        buildRoute(){
            this.route.delivery_places = this.formatBuildings();
            this.route.schedule = this.schedules;
            return this.route;
        },
        processRoute () {
            this.route = this.buildRoute();
            if(this.edit){
                this.update(this.route).then(
                    data => {
                        this.setWarning(data, { root: true }).then(()=>{
                            this.$router.push('/routeDetail/'+this.edit)
                        })
                    },
                    error => {
                })
            }else{
                this.create(this.route).then(
                    data => {
                        this.setWarning(data, { root: true }).then(()=>{
                            this.$router.push('/routeList')
                        })
                    },
                    error => {
                })
            }
        },
        redirect(page){
            if(page){
                this.$router.push('/routeDetail/'+this.edit)
            }else{
                this.$router.push('/routeList')
            }
        }
    },
    computed:{
        ...mapState({
            warning: state => state.warning,
            places: state => state.placeDelivery.places,
            sto: state => state.route.route, 
        }),
        trySend(){
            if(this.route && this.route.name && this.route.sector){
                return false; 
            }
            return true;
        }
    },
  }
</script>

