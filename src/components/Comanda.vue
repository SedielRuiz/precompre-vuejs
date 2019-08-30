<template>
    <v-container>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 md12>
                <v-card class="elevation-12">
                <v-toolbar dark color="primary">
                    <v-toolbar-title>Comandas</v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                    <v-div v-if="comandas">
                        <v-card class="elevation-12" v-for="(comanda, index) in comandas" :key="index">
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click="processComanda(comanda._id, 'ready')">Listo</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-div>   
                </v-card-text>
                </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  import {mapActions,mapState} from 'vuex';
  
  export default {
    name: 'comandas',
    data () {
        return {
            
        }
    },
    watch:{
    },
    mounted () {
        //this.fetchComandas();
    },
    methods: {
        ...mapActions({
            fetchComandas: 'comanda/fetchComandas',
            updateComanda: 'comanda/update',
            setWarning: 'setWarning',
        }),
        processComanda(id, status) {
            this.update({"_id":id, "status":status}).then(
                data => {
                    this.setWarning(data, { root: true }).then(()=>{
                        this.fetchComandas();
                    })
                },
                error => {
            })
        },
    },
    computed:{
      ...mapState({
        warning: state => state.warning,
        comandas: state => state.comanda.comandas,
      }),
    },
  }
</script>

