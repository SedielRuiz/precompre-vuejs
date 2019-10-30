<template>  
    <div>
        <h2>Observaciones <v-icon medium @click="view ? view = false : view = true">keyboard_arrow_down</v-icon></h2><hr><br>
        <div v-if="view">
            <div v-if="last">
                <v-checkbox align-center value input-value="true" label="Último contacto" v-model="last_cont"></v-checkbox>
            </div>
            <v-textarea class="box" v-model="observation" placeholder="Escriba su observación" prepend-icon="library_books" name="observation"></v-textarea>
            <v-btn medium color="primary" @click="sendObservation()">Agregar observación</v-btn><br><br>
            <v-card class="elevation-5 scrollObs">
                <v-container v-if="observations && observations.length > 0">
                    <div v-for="(ob, index) in observations" :key="index">
                        Datos: {{ob.user ? ob.user : ""}}, {{ob.date ? ob.date.split("T")[0] : ""}},  {{ob.date ? getHour(ob.date) : ""}}<br>
                        <div v-if="last">
                            Último contacto: {{ !ob.hasOwnProperty("last_contact") ? "No" : ob.last_contact.split("T")[0] +" "+ getHour(ob.last_contact)}} <br>
                        </div>
                        Observación: {{ob.description}}<br><hr><br>
                    </div>   
                </v-container>
            </v-card><br>
        </div>
    </div>
</template>
<style>
    .box{
        padding: 0px 9px 0px;
    }
    .scroll{
        height: 229px;
        overflow:auto;
    }
    .scrollObs{
        height: 168px;
        overflow:auto;
    }
</style>
<script>
    import Vue from 'vue';

    export default {
        name: 'observation',
        props:['routeFetch', 'routeEdit', 'obs', 'id', 'last'],
        data () {
            return {
                observation:"",
                observations:[],
                view:false,
                last_cont:false,
            }
        },
        mounted () {
            //console.log(this.obs);
            //console.log(this.id);
            if(this.obs.length > 0){
                this.observations = this.obs;
                this.formatObs();
            }else{
                this.fetchObservations();
            }
        },
        methods: {
            formatObs(){
                if(this.observations){
                    this.observations.sort(function(a, b) {
                        a = new Date(a.date);
                        b = new Date(b.date);
                        return a>b ? -1 : a<b ? 1 : 0;
                    });
                }
            },
            getHour(date){
                var dt = new Date(date);
                return (dt.getHours() < 10 ? "0"+dt.getHours() : dt.getHours())+":"+(dt.getMinutes() < 10 ? "0"+dt.getMinutes() : dt.getMinutes())+":"+(dt.getSeconds() < 10 ? "0"+dt.getSeconds() :dt.getSeconds());
            },
            fetchObservations(){
                Vue.http.post(this.routeFetch+"/"+this.id).then(
                    response =>{
                        this.observations = response.data.result_set[0].observations;
                        if(this.observations == undefined){
                            this.observations = [];
                        }else{
                            this.formatObs();
                        }
                    }).catch(error=>{
                        console.log(error);
                    });
            },
            sendObservation(){
                var obj = { description: this.observation };
                if(this.last)
                    obj.last_contact = this.last_cont;
                var data = {
                    _id: this.id,
                    observation: obj,
                };
                Vue.http.post(this.routeEdit, data).then(
                    response =>{
                        this.fetchObservations();
                    }).catch(error=>{
                        console.log(error);
                    });
            },
        },
    }
</script>

