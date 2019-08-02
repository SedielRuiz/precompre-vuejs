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
                {{filters}}
              <div v-if="filters">
                <div v-for="(f, index) in filters">
                  <v-layout align-center justify-center row wra>
                      <v-flex xs4 md4>
                        <v-combobox :disabled="true" @change="updateFilter('name', f.name, index, false, false)" v-model="f.name" :items="itemsFilter" prepend-icon="filter_list" label="Filtro"></v-combobox>
                      </v-flex>
                      <v-flex xs4 md4>
                        <v-combobox @change="updateFilter('operator', f.operator, index, false, false)" v-model="f.operator" :items="f.operators " prepend-icon="group_work" label="Operador"></v-combobox>
                      </v-flex>
                      <v-flex v-if="f.type=='Array'" xs4 md4>
                        <v-combobox v-model="f.selected" :items="f.list" @change="updateFilter('selected', f.selected, index, false, true)" prepend-icon="email" label="Opciones"></v-combobox>
                      </v-flex>
                      <v-flex xs4 md4>
                        <div v-if="f && f.type"> 
                          <div v-if="f.type=='String' || f.type=='Number'">
                            <v-text-field @change="updateFilter('value', f.value, index, false, false)" v-model="f.value" prepend-icon="email" name="name" label="Valor" :type="f.type=='String' ? 'text': 'number'"></v-text-field>
                          </div>
                          <div v-else-if="f.type=='Array'">
                            <div v-if="f.value">
                              <v-chip v-for="lst in f.value" :key="lst.value">{{lst.text}} <v-icon medium @click="updateFilter('value', lst.value, index, true, false)">close</v-icon></v-chip>
                            </div>
                          </div>
                          <div v-else-if="f.type=='Select'">
                            <v-combobox v-model="f.value" :items="status" prepend-icon="email" label="Valor"></v-combobox>
                          </div>
                        </div>
                      </v-flex>
                  </v-layout>  
                </div>
              </div>
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
            this.filter = val;
            this.searchProducts({"filter":val.filter});
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

