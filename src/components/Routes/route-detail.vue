<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md10>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Detalle de ruta</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="success" @click="redirect(true)">Editar</v-btn>
            <v-btn color="error" @click="redirect(false)">Cancelar</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form>
                <v-text-field readonly v-model="route.name" prepend-icon="email" name="name" label="Nombre" type="text"></v-text-field>
                <v-textarea readonly v-model="route.sector" prepend-icon="library_books" name="sector" label="Sector"></v-textarea>
                <h2>Horarios</h2><br>
                <div v-if="route.schedule">
                    <v-chip v-for="(h, index) in route.schedule" :key="index">{{h}}</v-chip>
                </div>
                <hr><br>
                <h2>Edificios</h2><br>
                <div v-if="route.delivery_places">
                    <v-chip v-for="(b, index) in route.delivery_places" :key="index">{{b.name}}</v-chip>
                </div>
                <hr>
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
  .custom{
    font-size:15px;
  }
</style>
<script>
  import {mapActions,mapState} from 'vuex';
  
  export default {
    
    name: 'route-detail',
    data () {
      return {
        route: {},
        routes:[],
        edit:"",
      }
    },
    watch:{
        cmp(val){
          if(val){
            this.route = val;
          }
        },
    },
    mounted () {
        this.edit = this.$route.params.id == undefined ? 0 : this.$route.params.id;
        if(this.edit!=""){
            this.getRoute(this.edit);
        }
    },
    methods: {
        ...mapActions({
            getRoute: 'route/getRoute', 
            fetchPlaceDelivery: 'placeDelivery/fetchPlaces',
            setWarning: 'setWarning',
        }),
        redirect(page){
            if(page){
                this.$router.push('/routeManage/'+this.edit)
            }else{
                this.$router.push('/routeList')
            }
        }
    },
    computed:{
        ...mapState({
            warning: state => state.warning,
            cmp: state => state.route.route, 
        }),
    },
  }
</script>

