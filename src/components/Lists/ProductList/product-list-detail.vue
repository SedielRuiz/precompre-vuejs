<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md10>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Detalle lista de producto</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="success" @click="redirect(true)">Editar</v-btn>
            <v-btn color="success" @click="redirect(false)">Volver</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form>
                <v-text-field :disabled="true" v-model="filter.title" prepend-icon="title" name="title" label="Nombre" type="text"></v-text-field>
            </v-form>
            <v-data-table :headers="headers" :items="products" class="elevation-1">
            <template v-slot:items="props">
                <td>{{ props.item.name }}</td>
            </template>
            </v-data-table>
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
    
    name: 'product-list-detail',
    data () {
      return {
        headers: [
            {text:"Nombres", value:"name"},
            {text:"Estado", value:"status"},
        ],
        status:[
          {text: 'Activo', value:'enabled'},
          {text: 'Inactivo', value:'disabled'},
        ],
        filter: {},
        filters:[],
        edit:"",
      }
    },
    watch:{
        pl(val){
          if(val){
            this.filter = val.model_list[0];
            this.searchProducts({"filter":val.model_list[0].filter});
          }
        },
        itemFilter(val){
          if(val){
            this.getOperators(val);
            if(val.type == "Array"){
              this.fillList(val.value);
            }
          }
        },
    },
    mounted () {
      this.edit = this.$route.params.id == undefined ? 0 : this.$route.params.id;
      if(this.edit!=0){
          this.getProductList(this.edit);
      }
    },
    methods: {
        ...mapActions({
          searchProducts: 'productList/searchProducts',             
          getProductList: 'productList/getProductList', 
          setWarning: 'setWarning',
        }),
        redirect(page){
            if(page){
                this.$router.push('/productListManage/'+this.edit)
            }else{
                this.$router.push('/productListList')
            }
        }
    },
    computed:{
      ...mapState({
          warning: state => state.warning,
          pl: state => state.productList.productList, 
          products: state => state.productList.products, 
      }),
    },
  }
</script>

