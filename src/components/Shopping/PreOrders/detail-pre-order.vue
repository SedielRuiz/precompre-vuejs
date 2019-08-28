<template>
  <v-card class="elevation-12">
    <v-toolbar dark color="primary">
      <v-toolbar-title>Pre orden</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="error" @click="closeModal()">Cerrar</v-btn>
    </v-toolbar>
    <v-card-text>
        <v-form>
            <v-switch prepend-icon="title" v-model="all" :label="'Todos los '+ info.day"></v-switch>
            <v-select prepend-icon="title" :disabled="all" :items="days" v-model="date" label="Fecha" ></v-select>
            <v-select prepend-icon="title" :items="info.stripes" v-model="info.stripe" label="Hora" ></v-select>
        </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <!--v-btn color="primary" @click="processPermission()">Guardar</v-btn-->
    </v-card-actions>
  </v-card>
</template>

<script>
  import {mapActions,mapState} from 'vuex';
  
  export default {
    name: 'detail-pre-order',
    props:['info'],
    data () {
      return {
        preOrder:{},
        all:true,
        date:"",
        days:[],
      }
    },
    watch:{
        info(val){
            if(val){
                this.calculateNextWeek(true, val.date_order);
                this.all = val.all_day;
                this.info.stripe = this.info.stripes ? this.info.stripes[0].value : this.info.stripes = "";
            }
        },
        all(val){
            this.info.all_day = val;
            if(val){
                this.calculateNextWeek(false);
            }else{
                this.date = this.info.date_order ? this.info.date_order : "";
                this.info.date_order = this.info.date_order ? this.info.date_order : "";
            }
        }
    },
    mounted () {
    },
    methods: {
        ...mapActions({
            create: 'permission/create',
            update: 'permission/update',
            setWarning: 'setWarning',
        }),
        calculateNextWeek(days, date){
            var firstDay = new Date();
            var res = firstDay.getDay() == 0 ? 1 : firstDay.getDay();
            var so = res - this.info.code;
            var nextWeek = new Date( firstDay.getTime() + 7 * 24 * 60 * 60 * 1000);
            nextWeek = new Date(nextWeek.getTime() - so * 24 * 60 * 60 * 1000 );
            var dateForm = (nextWeek.getDate() < 10 ? "0"+nextWeek.getDate() : nextWeek.getDate()) + "/" + ((nextWeek.getMonth()+1) < 10 ? "0"+(nextWeek.getMonth()+1) : (nextWeek.getMonth()+1)) + "/" + nextWeek.getFullYear();
            if(days){
                this.calculateDays(nextWeek, dateForm);
            }
            this.date = date ? date : dateForm;
            this.info.date_order = this.date;
        },
        calculateDays(dayStart, dateInit){
            this.days = [];
            var nextWeek = dayStart;
            this.days.push({"text":this.info.day+" "+dateInit, "value":dateInit});
            for(var s = 0; s < 5; s++){
                nextWeek = new Date(nextWeek.getTime() + 7 * 24 * 60 * 60 * 1000 );
                var date = (nextWeek.getDate() < 10 ? "0"+nextWeek.getDate() : nextWeek.getDate()) + "/" + ((nextWeek.getMonth()+1) < 10 ? "0"+(nextWeek.getMonth()+1) : (nextWeek.getMonth()+1)) + "/" + nextWeek.getFullYear();
                this.days.push({"text":this.info.day+" "+date, "value":date});
            }
        },
        closeModal(){
            this.info.date_order = this.date && this.date.value ? this.date.value : this.date;
            this.$emit('closeModal', this.info);
        }
    },
    computed:{
        ...mapState({
            warning: state => state.warning,
        }),
    },
  }
</script>

