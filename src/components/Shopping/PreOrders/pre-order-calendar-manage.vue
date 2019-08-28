<template>

    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md12>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Pre ordenes</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="redirect(true)">Cancelar</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form>
                <v-dialog v-model="detail" persistent>
                    <detailPreOrder @closeModal = "closeModal" :info="info"></detailPreOrder>
                </v-dialog>
                <v-card class="pa-2" outlined tile>
                    <v-layout justify-center row wra>
                        <v-flex xs12 md1>
                            Horas
                            <div v-for="sp in stripes" :key="sp">
                                {{sp}}
                            </div> 
                        </v-flex>
                        <v-flex xs12 md10>
                            <v-layout justify-center row wra>
                                <v-flex xs12 md2 v-for="(or, index) in preOrders" :key="index">
                                    <label>{{or.day}}</label>
                                    <div v-for="sp in stripes" :key="sp">
                                        <v-btn color="success" @click="viewDetail(or, index)">{{or.all_day ? "Siempre" : or.date_order}}</v-btn>
                                        <div v-if="viewButton(or, sp)">
                                            <v-btn color="success" @click="viewDetail(or, index)">{{or.all_day ? "Siempre" : or.date_order}}</v-btn>
                                        </div>
                                        <div v-else>
                                            <v-btn :disabled="true" color="error">No hay</v-btn>
                                        </div>

                                    </div>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-form>   
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="processPreOrder()">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
</template>

<script>
  import {mapActions,mapState} from 'vuex';
  import detailPreOrder from '@/components/Shopping/PreOrders/detail-pre-order';
  
  export default {
    name: 'preo-order',
    components: {
      detailPreOrder,
    },
    data () {
      return {
        stripes:["06:00", "12:00", "18:00"],
        preOrders:[
            {"day":"Lunes", "stripes":[{"text":"06:00 AM", "value":"06:00"}, {"text":"18:00 PM", "value":"18:00"}], "stripe":"", "all_day":true, "code":1},
            {"day":"Martes", "stripes":[{"text":"06:00 AM", "value":"06:00"}, {"text":"12:00 PM", "value":"12:00"}], "stripe":"", "all_day":true, "code":2},
            {"day":"Miercoles", "stripes":[{"text":"06:00 AM", "value":"06:00"}, {"text":"12:00 PM", "value":"12:00"}], "stripe":"", "all_day":true, "code":3},
            {"day":"Jueves", "stripes":[{"text":"06:00 AM", "value":"06:00"}, {"text":"12:00 PM", "value":"12:00"}], "stripe":"", "all_day":true, "code":4},
            {"day":"Viernes", "stripes":[{"text":"06:00 AM", "value":"06:00"}, {"text":"12:00 PM", "value":"12:00"}], "stripe":"", "all_day":true, "code":5},
            {"day":"Sabado", "stripes":[{"text":"06:00 AM", "value":"06:00"}, {"text":"12:00 PM", "value":"12:00"}], "stripe":"", "all_day":true, "code":6},
            {"day":"Domingo", "stripes":[{"text":"06:00 AM", "value":"06:00"}, {"text":"12:00 PM", "value":"12:00"}], "stripe":"", "all_day":true, "code":0},
        ],
        info:{},
        detail:false,
      }
    },
    watch:{
    },
    mounted () {
    },
    methods: {
        ...mapActions({
            create: 'customer/create',
            update: 'customer/update',
            getCustomer: 'customer/getCustomer', 
            fetchPlaceDelivery: 'placeDelivery/fetchPlaces',
            setWarning: 'setWarning',
        }),
        viewButton(day, hour){
            for(var s = 0; s < day.length; s++){

            }
            return 
        },
        closeModal(info){
            this.preOrders[info.index] = info;
            this.info = {};
            this.detail = false;
        },
        viewDetail(pre, idx){
            this.info = {};
            this.info = pre;
            this.info.index = idx;
            this.detail = true;
        },
        buildPreOrder(){
            this.preOrders;
            return this.preOrders;
        },
        processPreOrder () {
            this.preOrders = this.buildPreOrder();
            console.log(this.preOrders);
            if(this.edit){
                this.update(this.preOrders).then(
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
      }),
    },
  }
</script>

