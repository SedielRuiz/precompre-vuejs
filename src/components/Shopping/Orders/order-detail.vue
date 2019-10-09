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
                <v-text-field readonly  v-model="order.delivery_date" prepend-icon="library_books" name="title" label="Fecha" type="text"></v-text-field>
                <h2>Productos</h2><hr><br>
                <div v-if="order.products">
                     <v-layout row wrap v-for="(item, index) in order.products">
                        <v-flex xs12 md12>
                            <v-card class="pa-2" outlined tile :key="index">
                                <v-layout align-center row wrap>
                                    <v-flex xs12 md2>
                                        <div v-if="getPhoto(item)!= 'nn'">
                                            <img class="col-xs-12 col-sm-12 col-md-8" :src="getPhoto(item)">
                                        </div>
                                        <div v-else>
                                            <p style="margin-left:16px;">No registra foto</p>
                                        </div>
                                    </v-flex>
                                    <v-flex xs12 md9>
                                        <label class="textd">Hora de entrega: 06:00 AM </label><br>
                                        <label class="textd">Producto: {{item.product.name}} </label><br>
                                        <div v-for="(attr) in item.attributes[0]" :key="index+1">
                                            <div v-for="(att) in attrs" :key="index">
                                                <div v-if="attr.attribute == att._id">
                                                    <label style="font-size: 12px;">
                                                        <div v-if="attr.value && att.visible && att.code != 'photo'">
                                                            {{att.code.charAt(0).toUpperCase() + att.code.slice(1)}}: {{attr.value.charAt(0).toUpperCase() + attr.value.slice(1)}}
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <label class="textd">Cantidad: {{item.quantity}} </label><br>
                                        <label class="textd">Precio: $ {{getPrice(item)}} </label><br><br>
                                    </v-flex>
                                </v-layout><hr>
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
<style>
    .textd{
        font-size:17px;
    }
</style>
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
                console.log(val);
                this.order = val;
                var ds = val.delivery_date.split("T")[0];
                ds = ds.split("-");
                var date = ds[2]+"/"+ds[1]+"/"+ds[0];
                this.order.delivery_date = date;
                this.order.products = val.items;
            }
        },
    },
    mounted () {
        this.fetchAttributes({page_size:-1});
        this.order_id = this.$route.params.id == undefined ? 0 : this.$route.params.id;
        this.getOrder(this.order_id);
    },
    methods: {
        ...mapActions({
            fetchAttributes: 'productAttribute/fetchAttributes',
            getOrder: 'order/getOrder',
            setWarning: 'setWarning',
        }),
        formatMoney(n, qty) {
            var num
            num = String(n*qty).replace(/\./g,'');
            if(!isNaN(num)){
                num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
                num = num.split('').reverse().join('').replace(/^[\.]/,'');
            }
            return num;
        },
        getPrice(item){
            var price = 0;
            var qty = item.quantity;
            var obj = this.attrs.find(element=>{return element.code == "price"});
            if(obj){
                price = item.attributes[0].find(element=>{return element.attribute == obj._id}).value;
            }
            return this.formatMoney(price, qty);
        },
        getPhoto(order){
            var src = "";
            var obj = this.attrs.find(element=>{return element.code == "photo"});
            if(obj){
                src = order.attributes[0].find(element=>{return element.attribute == obj._id});
            }
            if(!src){
                src = "nn";
            }else{
                src = src.value ? src.value : "nn";
            }
            return src;
        },
        buildNameProduct(product, sub){
            for(var r = 0; r < product.pivot_attributes.length; r++){
                if(sub.pivot == product.pivot_attributes[r]._id){
                    var name = product.pivot_attributes[r].code+" "+sub.option;
                }
            }
            return name;
        },
        redirect(){
            this.$router.push('/ordersList')
        }
    },
    computed:{
        ...mapState({
            warning: state => state.warning,
            ord: state => state.order.order,
            page_size: state => state.order.page_size,
            total_items: state => state.order.total_items,
            total_pages: state => state.order.total_pages,
            attrs: state => state.productAttribute.attributes,
        }),
    },
  }
</script>

