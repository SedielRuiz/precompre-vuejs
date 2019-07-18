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
              <div v-if="filters">
                <div v-for="f in filters">
                  <v-layout align-center justify-center row wra>
                      <v-flex xs4 md4>
                        <v-combobox v-model="f.name" :items="itemsFilter" prepend-icon="email" label="Filtro"></v-combobox>
                      </v-flex>
                      <v-flex xs4 md4>
                        <v-combobox v-model="f.operator" :items="getOperators(f.name)" prepend-icon="email" label="Operador"></v-combobox>
                      </v-flex>
                      <v-flex xs4 md4>
                        <v-text-field v-model="f.value" prepend-icon="email" name="name" label="Valor" type="text"></v-text-field>
                      </v-flex>
                  </v-layout>  
                </div>
              </div>
              <v-layout align-center justify-center row wra>
                <v-flex xs4 md4>
                  <v-combobox v-model="itemFilter" :items="itemsFilter" prepend-icon="email" label="Filtro"></v-combobox>
                </v-flex>
                <v-flex xs4 md4>
                  <v-combobox v-model="filter.operator" :items="operators" prepend-icon="email" label="Operador"></v-combobox>
                </v-flex>
                <v-flex xs4 md4>
                  <v-text-field v-model="filter.value" prepend-icon="email" name="name" label="Valor" type="text"></v-text-field>
                </v-flex>
                <v-icon medium @click="addFilter()">event</v-icon>
              </v-layout>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="processProductList()">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import {mapActions,mapState} from 'vuex';
  
  export default {
    
    name: 'product-list-manage',
    data () {
      return {
        filter: {},
        filters:[],
        itemFilter:"",
        edit:"",
        titleText:"",
        operators: [
          {text: 'Igual', value:'e-p', type: 'global'},
          {text: 'Mayor o igual', value:'gt', type: 'number'},
          {text: 'Menor o igual', value:'lt', type: 'number'},
          {text: 'Contenido', value:'hs', type: 'string'},
          {text: 'No contenido', value:'hsn', type: 'string'},
        ],
        itemsFilter:[
          {text: 'Nombre', value:'hsn', _type: 'number'},
        ],
      }
    },
    watch:{
        att(val){
          if(val){
            this.filter = val;
          }
        },
        itemFilter(val){
          this.getOperators(val);
        }
    },
    mounted () {
        this.edit = this.$route.params.id == undefined ? 0 : this.$route.params.id;
        if(this.edit!=""){
            this.titleText="Editar lista";
            this.getProductList(this.edit);
        }else{
          this.titleText="Nueva lista";
        }
    },
    methods: {
        ...mapActions({
            create: 'ProductList/create',
            update: 'ProductList/update',
            getProductList: 'productList/getProductList', 
            setWarning: 'setWarning',
        }),
        addFilter(){
          this.filter.name = this.itemFilter.value;
          this.filters.push(this.filter);
          this.filter = {};
        },
        removeFilter(){
          this.filters.splice(idx,1);
        },
        getOperators(item){
          console.log(item);
          var lst = [];
          for(var s = 0; s < this.operators.length; s++){
            if(this.operators[s].type != item._type || this.operators[s].type == 'global')
              lst.push(this.operators[s]);
          }
          return lst;
        },
        buildProductList(){
            this.filter.name = this.filter.name.toLowerCase().split(" ").join("_");
            return this.filter;
        },
        processProductList () {
            this.filter = this.buildProductList();
            if(this.edit){
                this.update(this.filter).then(
                    data => {
                        this.setWarning(data.message, { root: true }).then(()=>{
                            this.$router.push('/productListDetail/'+this.edit)
                        })
                    },
                    error => {
                })
            }else{
                this.create(this.filter).then(
                    data => {
                        this.setWarning(data.message, { root: true }).then(()=>{
                            this.$router.push('/productListList')
                        })
                    },
                    error => {
                })
            }
        },
        redirect(page){
            if(page){
                this.$router.push('/productListDetail/'+this.edit)
            }else{
                this.$router.push('/productListList')
            }
        }
    },
    computed:{
        ...mapState({
            warning: state => state.warning,
            att: state => state.productList.productList, 
        }),
    },
  }
</script>

