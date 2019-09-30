<template>  
    <div>
        <h2>Observaciones <v-icon medium @click="view ? view = false : view = true">keyboard_arrow_down</v-icon></h2><hr><br>
        <div v-if="view">
        <v-textarea class="box" v-model="observation" placeholder="Escriba su observación" prepend-icon="library_books" name="observation"></v-textarea>
        <v-btn medium color="primary" @click="sendObservation()">Agregar observación</v-btn><br><br>
        <v-card class="elevation-5 scrollObs">
            <v-container v-if="observations && observations.length > 0">
                <div v-for="(ob, index) in observations" :key="index">
                    Usuario: {{ob.user ? ob.user : ""}}<br>
                    Fecha: {{ob.date ? ob.date : ""}}<br>
                    Hora: {{ob.date ? ob.date : ""}} <br>
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
        props:['routeFetch', 'routeEdit',  'id'],
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
            fetchObservations(){
                Vue.http.post(this.routeFetch+"/"+this.id).then(
                    response =>{
                        this.observations = response.data.result_set[0].observations;
                    }).catch(error=>{
                        console.log(error);
                    });
            },
            sendObservation(){
                var data = {
                    _id: this.id,
                    observations: { description: this.observation },
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

