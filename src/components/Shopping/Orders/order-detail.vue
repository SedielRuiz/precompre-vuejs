<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md10>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Detalle de orden</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="success" @click="redirect()">Volver</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form>
                <v-text-field :disabled="true"  v-model="order.date" prepend-icon="library_books" name="title" label="Fecha" type="date"></v-text-field>
                <h2>Productos</h2><hr><br>
                <div v-if="order.products">
                     <v-layout row wrap v-for="(prd, index) in order.products">
                        <v-flex xs12 md12>
                            <v-card class="pa-2" outlined tile :key="index">
                                <h2>{{prd.product.name}}</h2><br>
                                <v-layout row wrap>
                                    <v-flex  xs12 md8>
                                        <v-layout row wrap >
                                            <v-flex xs12 m12 v-for="opc in prd.sub_product.options">
                                                <label>{{buildNameProduct(prd.product, opc)}}</label>
                                            </v-flex><br>
                                            <v-flex xs12 md12>
                                                <label>Cantidad: {{prd.quantity}}</label>
                                            </v-flex>
                                            <v-flex xs12 md12>
                                                <label>Precio: $ {{prd.sub_product.price}}</label>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex  xs12 md8>
                                        
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </div>  
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

<script>
  import {mapActions,mapState} from 'vuex';
  import pagination from '@/components/Pagination';
  
  export default {
    name: 'orders-list',
    components: {
      pagination,
    },
    data () {
        return {
            order_id:"",
            order:{},
        }
    },
    watch:{
        ord(val){
            if(val){
                this.order = val;
                this.order.products = val.items;
            }
        },
    },
    mounted () {
        this.order_id = this.$route.params.id == undefined ? 0 : this.$route.params.id;
        this.getOrder(this.order_id);
    },
    methods: {
        ...mapActions({
            getOrder: 'order/getOrder',
            setWarning: 'setWarning',
        }),
        buildNameProduct(product, sub){
            for(var r = 0; r < product.pivot_attributes.length; r++){
                if(sub.pivot == product.pivot_attributes[r]._id){
                    var name = product.pivot_attributes[r].code+" "+sub.option;
                }
            }
            return name;
        },
        redirect(){
            this.$router.push('/orders/'+this.order.customer)
        }
    },
    computed:{
        ...mapState({
            warning: state => state.warning,
            ord: state => state.order.order,
            page_size: state => state.order.page_size,
            total_items: state => state.order.total_items,
            total_pages: state => state.order.total_pages,
        }),
    },
  }
</script>

