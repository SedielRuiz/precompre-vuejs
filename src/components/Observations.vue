<template>  
    <div>
        <h2>Observaciones <v-icon medium @click="view ? view = false : view = true">keyboard_arrow_down</v-icon></h2><hr><br>
        <div v-if="view">
            <v-layout row wrap>
                <v-flex xs12 sm12 md6>
                </v-flex>
                <v-flex xs12 sm12 md6>
                    
                </v-flex>
            </v-layout>
            <v-textarea class="box" v-model="observation.text" prepend-icon="library_books" name="observation"></v-textarea>
            <v-btn medium color="primary" @click="sendObservation()">Agregar observación</v-btn><br><br>
            <v-card class="elevation-5 scroll">
                <div v-for="(ob, index) in observations" :key="index">
                </div>   
                <v-container>
                    <div>  
                        Usuario: Holi<br>
                        Fecha: 00/00/000<br>
                        Hora: 00:00:00 <br>
                        Observación: sdfghjkldfghjklñfghjklñ<br>
                    </div><hr><br>
                    <div>  
                        Usuario: Holi<br>
                        Fecha: 00/00/000<br>
                        Hora: 00:00:00 <br>
                        Observación: sdfghjkldfghjklñfghjklñ<br>
                    </div><hr><br>
                    <div>  
                        Usuario: Holi<br>
                        Fecha: 00/00/000<br>
                        Hora: 00:00:00 <br>
                        Observación: sdfghjkldfghjklñfghjklñ<br>
                    </div><hr><br>
                    <div>  
                        Usuario: Holi<br>
                        Fecha: 00/00/000<br>
                        Hora: 00:00:00 <br>
                        Observación: sdfghjkldfghjklñfghjklñ<br>
                    </div><hr><br>
                    <div>  
                        Usuario: Holi<br>
                        Fecha: 00/00/000<br>
                        Hora: 00:00:00 <br>
                        Observación: sdfghjkldfghjklñfghjklñ<br>
                    </div><hr><br><div>  
                        Usuario: Holi<br>
                        Fecha: 00/00/000<br>
                        Hora: 00:00:00 <br>
                        Observación: sdfghjkldfghjklñfghjklñ<br>
                    </div><hr><br>
                    <div>  
                        Usuario: Holi<br>
                        Fecha: 00/00/000<br>
                        Hora: 00:00:00 <br>
                        Observación: sdfghjkldfghjklñfghjklñ<br>
                    </div><hr><br>
                    <div>  
                        Usuario: Holi<br>
                        Fecha: 00/00/000<br>
                        Hora: 00:00:00 <br>
                        Observación: sdfghjkldfghjklñfghjklñ<br>
                    </div><hr><br>
                    <div>  
                        Usuario: Holi<br>
                        Fecha: 00/00/000<br>
                        Hora: 00:00:00 <br>
                        Observación: sdfghjkldfghjklñfghjklñ<br>
                    </div><hr><br>
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
</style>
<script>
    import Vue from 'vue';

    export default {
        name: 'observation',
        props:['route', 'id'],
        data () {
        return {
            observation:"",
            observations:[],
            view:false,
        }
        },
        mounted () {
            this.fetchObservations();
        },
        watch:{
        },
        methods: {
            addObservation(){
                this.observations.push(this.observation);
                console.log(this.observations);
            },
            fetchObservations(){
                /*Vue.http.post(this.route+"/"+id).then(
                    response =>{
                        this.observations = response.data;
                    }).catch(error=>{
                        console.log(error);
                    })
                });*/
            },
            sendObservation(){
                /*Vue.http.post(this.route+"/"+id).then(
                    response =>{
                        this.fetchObservations();
                    }).catch(error=>{
                        console.log(error);
                    })
                });*/
            },
        },
    }
</script>

