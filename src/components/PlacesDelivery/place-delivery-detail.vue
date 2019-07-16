<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md10>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Detalle de lugar de entrega</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="success" @click="redirect(true)">Editar</v-btn>
            <v-btn color="success" @click="redirect(false)">Volver</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form>
                <v-text-field :disabled="true" v-model="place.name" prepend-icon="email" name="name" label="Nombre" type="text"></v-text-field>
                <v-text-field :disabled="true" v-model="place.address" prepend-icon="email" name="address" label="Dirección" type="text"></v-text-field>
                <v-text-field :disabled="true" v-model="place.country" prepend-icon="email" name="country" label="País" type="text"></v-text-field>
                <v-text-field :disabled="true" v-model="place.city" prepend-icon="email" name="city" label="ciudad" type="text"></v-text-field>
                <h2>Unidades</h2><hr><br>
                <div v-if="unities">
                  <div v-for="(u, index) in unities">
                    <h3>{{u._type}} - {{u.qty}}</h3>
                    <v-chip v-for="(lst, index) in u.list" :key="index">{{lst.unit_name}}</v-chip>
                  </div><br>
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

<script>
  import {mapActions,mapState} from 'vuex';
  
  export default {
    
    name: 'user-manage',
    data () {
      return {
        place: {},
        unities:[],
        edit:"",
      }
    },
    watch:{
        pl(val){
          if(val){
            this.place = val;
            this.unities = val.unities;
          }
        },
    },
    mounted () {
        this.edit = this.$route.params.id == undefined ? 0 : this.$route.params.id;
        if(this.edit!=""){
            this.getPlace(this.edit);
        }
    },
    methods: {
      ...mapActions({
        getPlace: 'placeDelivery/getPlace', 
        setWarning: 'setWarning',
      }),
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

