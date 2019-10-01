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
                <v-text-field v-model="store.code" prepend-icon="email" name="code" label="Código" type="text"></v-text-field>
                <v-text-field v-model="store.name" prepend-icon="email" name="name" label="Nombre" type="text"></v-text-field>
                <v-textarea v-model="store.description" prepend-icon="library_books"name="description" label="Descripción"></v-textarea>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" :disabled="trySend" style="width: 100%;" @click="processStore()">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import {mapActions,mapState} from 'vuex';
  
  export default {
    
    name: 'store-manage',
    data () {
      return {
        store: {},
        edit:"",
        titleText:""
      }
    },
    watch:{
        sto(val){
          if(val){
            this.store = val;
          }
        },
    },
    mounted () {
        this.edit = this.$route.params.id == undefined ? 0 : this.$route.params.id;
        if(this.edit!=""){
            this.titleText="Editar tienda";
            this.getStore(this.edit);
        }else{
          this.titleText="Nueva tienda";
        }
    },
    methods: {
        ...mapActions({
            create: 'stores/create',
            update: 'stores/update',
            getStore: 'stores/getStore', 
            setWarning: 'setWarning',
        }),
        buildCampaign(){
            return this.store;
        },
        processStore () {
            this.store = this.buildCampaign();
            if(this.edit){
                this.update(this.store).then(
                    data => {
                        this.setWarning(data, { root: true }).then(()=>{
                            this.$router.push('/storeDetail/'+this.edit)
                        })
                    },
                    error => {
                })
            }else{
                this.create(this.store).then(
                    data => {
                        this.setWarning(data, { root: true }).then(()=>{
                            this.$router.push('/storeList')
                        })
                    },
                    error => {
                })
            }
        },
        redirect(page){
            if(page){
                this.$router.push('/storeDetail/'+this.edit)
            }else{
                this.$router.push('/storeList')
            }
        }
    },
    computed:{
        ...mapState({
            warning: state => state.warning,
            sto: state => state.stores.store, 
        }),
        trySend(){
            if(this.store && this.store.code && this.store.name){
                return false; 
            }
            return true;
        }
    },
  }
</script>

