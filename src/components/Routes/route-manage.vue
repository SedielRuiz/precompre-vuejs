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
                <h2>Horarios</h2><hr><br>
                <v-layout row wrap>
                    <v-flex xs12 sm12 md7>
                        <v-time-picker v-model="schedule" :landscape="$vuetify.breakpoint.smAndUp" ampm-in-title ></v-time-picker><br>
                    </v-flex>
                    <v-flex xs12 sm12 md2>
                        <v-btn color="primary" @click="addArray('h')">Agregar</v-btn>
                    </v-flex>
                    <v-flex xs12 sm12 md3>
                        <v-chip v-for="(h, index) in schedules" :key="index">{{h}} <v-icon medium @click="removeArray('h', index)">close</v-icon></v-chip>
                    </v-flex>
                </v-layout>
                <hr><br><br>
                <h2>Edificios <v-icon medium @click="addBuilding ? addBuilding = false : addBuilding = true">keyboard_arrow_down</v-icon></h2><br>
                <br>
                <div v-if="addBuilding" class="row col-md-8">
                    <v-card style="height: 100%;width: 84%; padding: 31px;">
                    <!--EDIFICIOS-->
                    <v-data-table v-model="buildingsSelected" :headers="headers" :items="places" :pagination.sync="pagination" select-all item-key="address" class="elevation-1">
                        <template v-slot:headers="props">
                            <tr>
                                <th>
                                    <v-checkbox :input-value="props.all" :indeterminate="props.indeterminate" primary hide-details  @click.stop="removeBuildings"></v-checkbox>
                                </th>
                                <th v-for="header in props.headers" :key="header.text" :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']" @click="changeSort(header.value)">
                                    <v-icon small>arrow_upward</v-icon>
                                    {{ header.text }}
                                </th>
                            </tr>
                        </template>
                        <template v-slot:items="props">
                            <tr :active="props.selected" @click="props.selected = !props.selected">
                                <td>
                                    <v-checkbox :input-value="props.selected" primary hide-details></v-checkbox>
                                </td>
                                <td class="text-xs-center">{{ props.item.name }}</td>
                                <td class="text-xs-center">{{ props.item.address }}</td>
                            </tr>
                        </template>
                    </v-data-table>
                    <!--EDIFICIOS-->
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
        pagination: {
            sortBy: 'name'
        },
        headers: [
            {text:"Nombre", value:"name"},
            {text:"Dirección", value:"address"},
        ],
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
            if(val.delivery_places.length > 0){
                this.addBuilding = true;
                this.buildingsSelected = val.delivery_places;
            }
          }
        },
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
        removeBuildings () {
            if (this.buildingsSelected.length) this.buildingsSelected = []
            else this.buildingsSelected = this.places.slice()
        },
        changeSort (column) {
            if (this.pagination.sortBy === column) {
            this.pagination.descending = !this.pagination.descending
            } else {
            this.pagination.sortBy = column
            this.pagination.descending = false
            }
        },
        addArray(opc){
            switch(opc){
                case "h":
                    this.schedules.push(this.schedule);
                    this.schedule = "";
                    break;
            }
        },
        removeArray(opc, idx){
            switch(opc){
                case "h":
                    this.schedules.splice(idx, 1);
                    break;
            }
        },
        formatBuildings(){
            var lst = []
            for(var s = 0; s < this.buildingsSelected.length; s++){
                lst.push(this.buildingsSelected[s]._id);
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

