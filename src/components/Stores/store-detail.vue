<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md10>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Detalle de tienda</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="success" @click="redirect(true)">Editar</v-btn>
            <v-btn color="error" @click="redirect(false)">Cancelar</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form>
                <v-text-field success color="#7B7474" style="color: #7B7474 !important" readonly v-model="store.code" prepend-icon="email" name="code" label="Código" type="text"></v-text-field>
                <v-text-field readonly v-model="store.name" prepend-icon="email" name="name" label="Nombre" type="text"></v-text-field>
                <v-textarea readonly v-model="store.description" prepend-icon="library_books"name="description" label="Descripción"></v-textarea>
                <v-text-field readonly v-model="store.url" prepend-icon="email" name="name" label="Url" type="text"></v-text-field>
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
    
    name: 'store-detail',
    data () {
      return {
        store: {},
        stores:[],
        edit:"",
      }
    },
    watch:{
        cmp(val){
          if(val){
            this.store = val;
          }
        },
    },
    mounted () {
        this.edit = this.$route.params.id == undefined ? 0 : this.$route.params.id;
        if(this.edit!=""){
            this.getStore(this.edit);
        }
    },
    methods: {
        ...mapActions({
            getStore: 'stores/getStore', 
            setWarning: 'setWarning',
        }),
        redirect(page){
            if(page){
                this.$router.push('/storeManage/'+this.edit)
            }else{
                this.$router.push('/storeList')
            }
        }
    },
    computed:{
        ...mapState({
            warning: state => state.warning,
            cmp: state => state.stores.store, 
        }),
    },
  }
</script>

