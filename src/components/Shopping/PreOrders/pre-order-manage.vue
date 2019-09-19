<template>
    <v-container>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 md12>
                <v-card class="elevation-12">
                <v-toolbar dark color="primary">
                    <v-toolbar-title>Pre orden</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="redirect(true)">Cancelar</v-btn>
                </v-toolbar>
                <v-card-text>
                    <v-form>
                        <v-card class="pa-2" outlined tile>
                            <h3>Datos pre orden</h3>
                            <v-text-field :disabled="preOrder.finish" v-model="preOrder.name" prepend-icon="library_books" name="title" label="Nombre" type="text"></v-text-field>
                            <v-layout row wra>
                                <v-flex xs12 md6>
                                    <v-combobox :disabled="preOrder.finish" prepend-icon="filter_list" v-model="preOrder.deliveryPlace" :items="formatList(customer.delivery_places, 'name', 'id', 'unit_name')" label="Lugares de entrega"></v-combobox>
                                </v-flex>
                                <v-flex xs12 md6>
                                    <v-combobox :disabled="preOrder.finish" prepend-icon="filter_list" v-model="preOrder.hour" :items="hours" label="Hora"></v-combobox>
                                </v-flex>
                            </v-layout><br>
                            <h3>Productos pre orden</h3>
                            <v-layout row wra>
                                <v-flex xs12 md4>
                                    <v-combobox prepend-icon="filter_list" v-model="product" :items="products" label="Producto"></v-combobox>
                                </v-flex>  
                                <v-flex xs12 md4>
                                    <v-text-field v-model="product.quantity" prepend-icon="library_books" name="title" label="Cantidad" type="number"></v-text-field>
                                </v-flex>  
                                <v-flex xs12 md6>
                                    <v-text-field :disabled="true" v-model="product.price" prepend-icon="library_books" name="title" label="Precio" type="text"></v-text-field>
                                </v-flex>        
                            </v-layout>
                            <v-layout row wra v-if="attributes">
                                <div v-for="(attr, index) in attributes" :key="index+'_'+attr.code">
                                    <div v-if="attr.visible && attr.code != 'photo' && attr.variable">
                                        <div v-if="attr.options && attr.options.length > 0">
                                            <v-flex xs12 md12>
                                                <v-combobox :disabled="attr.custom" @change="findPrice()" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" :items="formatList(attr.options, 'code', 'code')" prepend-icon="filter_list" :label="attr.code"></v-combobox>
                                            </v-flex>
                                        </div>
                                        <div v-else>
                                            <div v-if="attr.type == 'boolean'">
                                                <v-flex xs12 md12>
                                                    <v-switch :disabled="attr.custom" :key="index+'_'+attr.code" prepend-icon="title" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" :label="attr.code"></v-switch>
                                                </v-flex>
                                            </div>
                                            <div v-else>
                                                <div v-if="attr.size == 'short'">
                                                    <v-flex xs12 md12>
                                                        <v-text-field :disabled="attr.custom" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" prepend-icon="library_books" name="title" :label="attr.code" :type="attr.type"></v-text-field>
                                                    </v-flex>
                                                </div>
                                                <div v-else-if="attr.size == 'medium'">
                                                    <v-flex xs12 md12>
                                                        <v-textarea :disabled="attr.custom" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" prepend-icon="library_books" height="77px" name="mediumText" :label="attr.code"></v-textarea>
                                                    </v-flex>
                                                </div>
                                                <div v-else>
                                                    <v-flex xs12 md12>
                                                        <v-textarea :disabled="attr.custom" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" prepend-icon="library_books" height="135px" name="mediumText" :label="attr.code"></v-textarea>
                                                    </v-flex>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </v-layout>
                            <v-layout row wra>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click="addArray('p')">Agregar producto</v-btn>
                            </v-layout><br>
                            <h3 v-if="productsCart.length > 0">Programa tu semana</h3><br>
                            <div v-for="(sc, index) in productsCart">
                                <v-layout row wra>
                                    <v-flex xs12 md1>
                                        <v-text-field v-model="sc.quantity" name="quantity" label="Cantidad" type="number"></v-text-field>
                                    </v-flex> 
                                    <v-flex xs12 md3>
                                        <v-combobox :disabled="true" prepend-icon="filter_list" v-model="sc.text" label="Producto"></v-combobox>
                                    </v-flex>
                                    <v-flex align-center xs12 md1>
                                        <v-icon medium @click="sc.viewAtt ? sc.viewAtt = false : sc.viewAtt = true">add</v-icon>
                                    </v-flex>
                                    <v-flex xs12 md2>
                                        <v-text-field :disabled="true" v-model="sc.price" name="quantity" label="Precio" type="number"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 md10>
                                        <v-layout justify-center row wra>
                                            <v-flex xs12 md2 cols="12" sm="4" md="2">
                                                <label>Lunes</label>
                                                <v-checkbox v-model="sc.lunes"></v-checkbox>
                                            </v-flex>
                                            <v-flex xs12 md2 cols="12" sm="4" md="2">
                                                <label>Martes</label>
                                                <v-checkbox v-model="sc.martes"></v-checkbox>
                                            </v-flex>
                                            <v-flex xs12 md2 cols="12" sm="4" md="2">
                                                <label>Miercoles</label>
                                                <v-checkbox v-model="sc.miercoles"></v-checkbox>
                                            </v-flex>
                                            <v-flex xs12 md2 cols="12" sm="4" md="2">
                                                <label>Jueves</label>
                                                <v-checkbox v-model="sc.jueves"></v-checkbox>
                                            </v-flex>
                                            <v-flex xs12 md2 cols="12" sm="4" md="2">
                                                <label>Viernes</label>
                                                <v-checkbox v-model="sc.viernes"></v-checkbox>
                                            </v-flex>
                                            <v-flex xs12 md2 cols="12" sm="4" md="2">
                                                <label>Sabados</label>
                                                <v-checkbox v-model="sc.sabado"></v-checkbox>
                                            </v-flex>
                                            <v-flex xs12 md2 cols="12" sm="4" md="2">
                                                <label>Domingos</label>
                                                <v-checkbox v-model="sc.domingo"></v-checkbox>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex align-center  xs12 md1>
                                        <v-layout justify-center row wra>
                                            <v-icon medium @click="removeArray('g', 'productsCart', index)">close</v-icon></v-chip>
                                        </v-layout>
                                    </v-flex>
                                </v-layout>
                                <v-layout justify-center row wra>
                                    <v-flex xs12 md12>
                                        <div v-if="sc.viewAtt">
                                            <v-layout row wra>
                                                <div v-for="(attrr, index) in sc.attributes" :key="index+'_'+attrr.code+'_prg'" class="row col-md-8">
                                                    <div v-if="attrr.visible && attrr.code != 'photo'">
                                                        <div v-if="attrr.options && attrr.options.length > 0">
                                                            <v-combobox  :disabled="attrr.custom" :key="index+'_'+attrr.code+'_prg'" v-model="!attrr.value && attrr.value != ''? attrr.value = attrr.default_value : attrr.value" :items="formatList(attrr.options, 'code', 'code')" prepend-icon="filter_list" :label="attrr.code"></v-combobox>
                                                        </div>
                                                        <div v-else>
                                                            <div v-if="attrr.type == 'boolean'">
                                                                <v-switch :disabled="attrr.custom" :key="index+'_'+attrr.code+'_prg'" prepend-icon="title" v-model="!attrr.value && attrr.value != ''? attrr.value = attrr.default_value : attrr.value" :label="attrr.code"></v-switch>
                                                            </div>
                                                            <div v-else>
                                                                <div v-if="attrr.size == 'short'">
                                                                    <v-text-field :disabled="attrr.custom" :key="index+'_'+attrr.code+'_prg'" v-model="!attrr.value && attrr.value != ''? attrr.value = attrr.default_value : attrr.value" prepend-icon="library_books" name="title" :label="attrr.code" type="text"></v-text-field>
                                                                </div>
                                                                <div v-else-if="attrr.size == 'medium'">
                                                                    <v-textarea :disabled="attrr.custom" :key="index+'_'+attrr.code+'_prg'" v-model="!attrr.value && attrr.value != ''? attrr.value = attrr.default_value : attrr.value" prepend-icon="library_books" height="77px" name="mediumText" :label="attrr.code"></v-textarea>
                                                                </div>
                                                                <div v-else>
                                                                    <v-textarea :disabled="attrr.custom" :key="index+'_'+attrr.code+'_prg'" v-model="!attrr.value && attrr.value != ''? attrr.value = attrr.default_value : attrr.value" prepend-icon="library_books" height="135px" name="mediumText" :label="attrr.code"></v-textarea>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </v-layout>
                                        </div>
                                    </v-flex>
                                </v-layout>
                            </div><br>
                             <v-layout row wra>
                                <v-btn style="width:100%" :disabled="productsCart.length == 0 ? true : false" color="primary" @click="addArray('cart')">Agregar pre orden</v-btn>
                            </v-layout><br>
                        </v-card><br>
                        <div v-if="shoppingCart.length > 0">
                            <h2>Pre ordenes</h2><hr><br>
                            <div v-for="(sh, index) in shoppingCart" :key="index">
                                <v-card class="pa-2" outlined tile >
                                    <v-layout row wra>
                                        <v-flex xs12 md8>
                                            <h2>{{sh.name}}</h2>
                                            Lugar de entrega: {{sh.delivery_place.text}}<br>
                                            Hora de entrega: {{sh.hour.text}} <br>
                                        </v-flex>
                                        <v-flex xs12 md2>
                                            <v-btn color="success" @click="sh.addProduct ? sh.addProduct = false : sh.addProduct = true">Producto</v-btn>
                                        </v-flex>
                                        <v-flex xs12 md2>
                                            <v-btn color="error" @click="removeArray('g', 'shoppingCart' , index)">Quitar</v-btn>
                                        </v-flex>
                                    </v-layout>
                                    
                                    <div v-if="sh.addProduct">
                                        <v-layout row wra>
                                            <v-flex xs12 md4>
                                                <v-combobox prepend-icon="filter_list" v-model="product" :items="products" label="Producto"></v-combobox>
                                            </v-flex>  
                                            <v-flex xs12 md4>
                                                <v-text-field v-model="product.quantity" prepend-icon="library_books" name="title" label="Cantidad" type="number"></v-text-field>
                                            </v-flex>  
                                            <v-flex xs12 md4>
                                                <v-text-field :disabled="true" v-model="product.unit_value" prepend-icon="library_books" name="title" label="Precio" type="text"></v-text-field>
                                            </v-flex>  
                                            <v-flex xs12 md2>
                                                <v-btn color="primary" :disabled="!product ? true : false" @click="addArray('p', true, index)">Agregar</v-btn>
                                            </v-flex>        
                                        </v-layout>
                                        <v-layout row wra v-if="attributes">
                                            <div v-for="(attr, index) in attributes" :key="index+'_'+attr.code">
                                                <div v-if="attr.visible && attr.code != 'photo'">
                                                    <div v-if="attr.options && attr.options.length > 0">
                                                        <v-flex xs12 md12>
                                                            <v-combobox :disabled="attr.custom" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" :items="formatList(attr.options, 'code', 'code')" prepend-icon="filter_list" :label="attr.code"></v-combobox>
                                                        </v-flex>
                                                    </div>
                                                    <div v-else>
                                                        <div v-if="attr.type == 'boolean'">
                                                            <v-flex xs12 md12>
                                                                <v-switch :disabled="attr.custom" :key="index+'_'+attr.code" prepend-icon="title" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" :label="attr.code"></v-switch>
                                                            </v-flex>
                                                        </div>
                                                        <div v-else>
                                                            <div v-if="attr.size == 'short'">
                                                                <v-flex xs12 md12>
                                                                    <v-text-field :disabled="attr.custom" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" prepend-icon="library_books" name="title" :label="attr.code" :type="attr.type"></v-text-field>
                                                                </v-flex>
                                                            </div>
                                                            <div v-else-if="attr.size == 'medium'">
                                                                <v-flex xs12 md12>
                                                                    <v-textarea :disabled="attr.custom" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" prepend-icon="library_books" height="77px" name="mediumText" :label="attr.code"></v-textarea>
                                                                </v-flex>
                                                            </div>
                                                            <div v-else>
                                                                <v-flex xs12 md12>
                                                                    <v-textarea :disabled="attr.custom" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" prepend-icon="library_books" height="135px" name="mediumText" :label="attr.code"></v-textarea>
                                                                </v-flex>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </v-layout>
                                    </div>

                                    <hr><br>
                                    <div v-for="(sc, index) in sh.productsCart" :key="index">
                                        <v-layout row wra>
                                            <v-flex xs12 md1>
                                                <v-text-field v-model="sc.quantity" name="quantity" label="Cantidad" type="number"></v-text-field>
                                            </v-flex> 
                                            <v-flex xs12 md3>
                                                <v-combobox :disabled="true" prepend-icon="filter_list" v-model="sc.text" label="Producto"></v-combobox>
                                            </v-flex>
                                            <v-flex align-center xs12 md1>
                                                <v-icon medium @click="sc.viewAtt ? sc.viewAtt = false : sc.viewAtt = true">add</v-icon>
                                            </v-flex>
                                            <v-flex xs12 md2>
                                                <v-text-field :disabled="true" v-model="sc.price" name="quantity" label="Precio" type="number"></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 md10>
                                                <v-layout justify-center row wra>
                                                    <v-flex xs12 md2 cols="12" sm="4" md="2">
                                                        <label>Lunes</label>
                                                        <v-checkbox v-model="sc.lunes"></v-checkbox>
                                                    </v-flex>
                                                    <v-flex xs12 md2 cols="12" sm="4" md="2">
                                                        <label>Martes</label>
                                                        <v-checkbox v-model="sc.martes"></v-checkbox>
                                                    </v-flex>
                                                    <v-flex xs12 md2 cols="12" sm="4" md="2">
                                                        <label>Miercoles</label>
                                                        <v-checkbox v-model="sc.miercoles"></v-checkbox>
                                                    </v-flex>
                                                    <v-flex xs12 md2 cols="12" sm="4" md="2">
                                                        <label>Jueves</label>
                                                        <v-checkbox v-model="sc.jueves"></v-checkbox>
                                                    </v-flex>
                                                    <v-flex xs12 md2 cols="12" sm="4" md="2">
                                                        <label>Viernes</label>
                                                        <v-checkbox v-model="sc.viernes"></v-checkbox>
                                                    </v-flex>
                                                    <v-flex xs12 md2 cols="12" sm="4" md="2">
                                                        <label>Sabados</label>
                                                        <v-checkbox v-model="sc.sabado"></v-checkbox>
                                                    </v-flex>
                                                    <v-flex xs12 md2 cols="12" sm="4" md="2">
                                                        <label>Domingos</label>
                                                        <v-checkbox v-model="sc.domingo"></v-checkbox>
                                                    </v-flex>
                                                </v-layout>
                                            </v-flex>
                                            <v-flex align-center  xs12 md1>
                                                <v-layout justify-center row wra>
                                                    <v-icon medium @click="removeArray('p', 'productsCart', sh.index, index)">close</v-icon></v-chip>
                                                </v-layout>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout justify-center row wra>
                                            <v-flex xs12 md12>
                                                <div v-if="sc.viewAtt">
                                                    <v-layout row wra>
                                                        <div v-for="(attr, index) in sc.attributes" :key="index+'_'+attr.code" class="row col-md-8">
                                                            <div v-if="attr.visible && attr.code != 'photo'">
                                                                <div v-if="attr.options && attr.options.length > 0">
                                                                    <v-combobox  :disabled="attr.custom" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" :items="formatList(attr.options, 'code', 'code')" prepend-icon="filter_list" :label="attr.code"></v-combobox>
                                                                </div>
                                                                <div v-else>
                                                                    <div v-if="attr.type == 'boolean'">
                                                                        <v-switch :disabled="attr.custom" :key="index+'_'+attr.code" prepend-icon="title" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" :label="attr.code"></v-switch>
                                                                    </div>
                                                                    <div v-else>
                                                                        <div v-if="attr.size == 'short'">
                                                                            <v-text-field :disabled="attr.custom" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" prepend-icon="library_books" name="title" :label="attr.code" type="text"></v-text-field>
                                                                        </div>
                                                                        <div v-else-if="attr.size == 'medium'">
                                                                            <v-textarea :disabled="attr.custom" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" prepend-icon="library_books" height="77px" name="mediumText" :label="attr.code"></v-textarea>
                                                                        </div>
                                                                        <div v-else>
                                                                            <v-textarea :disabled="attr.custom" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" prepend-icon="library_books" height="135px" name="mediumText" :label="attr.code"></v-textarea>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </v-layout>
                                                </div>
                                            </v-flex>
                                        </v-layout>
                                    </div>
                                     <v-layout justify-center row wra>
                                        <v-spacer></v-spacer>
                                        
                                    </v-layout>
                                </v-card><br>
                            </div>
                        </div><br>
                        
                        <v-card class="pa-2" outlined tile v-if="preOrders.length > 0">
                            <v-layout row wra>
                                <v-flex v-for="(day, index) in preOrders" :key="index" xs12 sm12 md2>
                                    <v-card class="mx-auto">
                                        <v-card-title><h1>{{formarDay(day.pre_orders)}}</h1></v-card-title>
                                        <v-card-text>
                                            <h2>Productos </h2><hr><br>
                                            <div v-for="prd in day.pre_orders">
                                                <label>Nombre: {{prd.item.product.name}}</label><br>
                                                <label>Precio: $ {{prd.item.product.price ? prd.item.product.price : 0}} </label><br>
                                                <label>Catidad: {{prd.item.quantity}}</label><br>
                                                <label>Lugar de entrega : {{prd.delivery_place.name}} {{prd.delivery_place.unit_name}}</label>
                                                <v-btn text small class="primary" @click="editPreOrder(index, prd)">Editar</v-btn>
                                                <v-btn text small class="primary" @click="deletePreOrder(prd._id._id)">Eliminar</v-btn><hr><br>
                                            </div>
                                            <v-dialog v-model="detail" persistent>
                                                <detailPreOrder @closeModal = "closeModal" :sc="info" :customer="customer"></detailPreOrder>
                                            </v-dialog>
                                        </v-card-text>
                                    </v-card>
                                </v-flex>
                            </v-layout>
                        </v-card><br>
                    </v-form>   
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" :disabled="trySend" style="width:100%" @click="processPreOrder()">Finalizar</v-btn>
                </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<style>
    .day{
        width:500px !important;
    }
    .subTitle{
        font-size:20px;
    }
    .v-input--selection-controls {
        margin-top: 3px;
        padding-top: 0px;
        padding:8px;
    }
</style>
<script>
  import {mapActions,mapState} from 'vuex';
  import detailPreOrder from '@/components/Shopping/PreOrders/detail-pre-order';

  export default {
    name: 'preo-order',
    components: {
      detailPreOrder,
    },
    data () {
        return {
            hours:[
                {text:"06:00 AM", value:"06:00"},
            ],
            preOrder:{},
            productsCart:[],
            subProductsAttribute:[],
            deliveryPlace:"",
            deliveryPlaces:[],
            customer_id:"",
            addProduct:false,
            quantity:0,
            shoppingCart:[],
            shoppingCartEdit:[],
            week:[],
            product:"",
            products:[],
            attributes:[],
            detail:false,
            info:"",
        }
    },
    watch:{
        prds(val){
            if(val){
                this.products = [];
                for(var s = 0; s < val.length; s++){
                    if(val[s].status == "enable"){
                        this.products.push({"text":val[s].name, "sub_products":val[s].sub_products, "principal_value":val[s]._id, "attributes":val[s].attributes, "categories":val[s].categories, "class":val[s].product_class, "price":val[s].default_price});
                    }
                }
            }
        },
        product(val){
            if(val){
                this.product.product_id = val.principal_value;
                this.product.sub_product = val.sub_value;
                //this.product.unit_value = val.price;
                this.attributes = val.class.attributes;
                this.attributes = this.attributes.concat(val.class.order_attributes);
                this.replaceValue(val.attributes);
            }
        },
    },
    mounted () {
        this.preOrder.hour = this.hours[0];
        this.fetchProducts();
        this.customer_id = this.$route.params.id == undefined ? 0 : this.$route.params.id;
        if(!this.customer){
            this.getCustomer(this.customer_id);
        }
        this.fetchPreOrdersCustomer(this.customer_id);
    },
    methods: {
        ...mapActions({
            create: 'preOrder/create',
            delete: 'preOrder/delete',
            fetchPreOrdersCustomer: 'preOrder/fetchPreOrdersCustomer',
            fetchProducts: 'product/fetchProducts',
            getCustomer: 'customer/getCustomer', 
            setWarning: 'setWarning',
        }),
        findPrice(){
            console.log(this.productsCart);
            console.log(this.product.sub_products);
            console.log(this.attributes);
            this.productsCart.push();
            let pivot = true;
            var price = 0;
            for(var r = 0; r < this.product.sub_products.length; r++){
                pivot = true;
                console.log(r);
                for(var g = 0; g < this.product.sub_products[r].options.length; g++){
                    for(var s = 0; s < this.attributes.length; s++){
                        var valurVal = this.attributes[s].value && this.attributes[s].value.value ? this.attributes[s].value.value : this.attributes[s].value;
                        console.log(this.attributes[s]);
                        if( (this.attributes[s].code != "recipe" && this.attributes[s].code != "photo") &&
                            (this.attributes[s]._id == this.product.sub_products[r].options[g].pivot) && 
                            (valurVal != this.product.sub_products[r].options[g].option) )
                        {
                            if(this.attributes[s].code == "price")
                            {
                                price = this.product.sub_products[r].options[g].option;
                            }else{
                                if(this.attributes[s].visible && this.attributes[s].custom == false){
                                    console.log("llegue aca");
                                    pivot = false;
                                    break;
                                }
                            }
                        }

                    }
                    if(pivot){
                        break
                    }
                }
                if(pivot){
                    break
                }
            }
            this.product.price = price;
        },
        closeModal(info){
            this.info = "";
            this.detail = false;
            this.fetchPreOrdersCustomer(this.customer_id);
        },
        buildNameProduct(base, product, sub){
            var name = base;
            for(var s = 0; s < sub.options.length; s++){
                for(var r = 0; r < product.product_class.order_attributes.length; r++){
                    if(sub.options[s].pivot == product.product_class.order_attributes[r]._id){
                        name += ", "+product.product_class.order_attributes[r].code+" "+sub.options[s].option;
                    }
                }
            }
            return name;
        },
        deletePreOrder(id){
            if(confirm('Seguro dese eliminar esta pre orden ? ')){
                this.delete(id).then(
                    data => {
                        this.setWarning(data, { root: true }).then(()=>{
                            this.fetchPreOrdersCustomer(this.customer_id);
                        })
                    },
                    error => {
                });
            }
        },
        editPreOrder(idx, product){
            for(var s = 0; s < this.preOrders.length; s++){
                if(this.preOrders[s].pre_orders.length > 0){
                    for(var r = 0; r < this.preOrders[s].pre_orders.length; r++){
                        if( (this.preOrders[s].pre_orders[r].item.product._id == product.item.product._id) ){
                            var p = this.groupDay(this.preOrders[s].pre_orders[r], product);
                            if(p){
                                this.shoppingCartEdit[p.pos].days = p.days;
                            }
                        }
                    }
                }
            }
            this.formatShopping();
            this.info = {};
            this.info = this.shoppingCartEdit;
            this.shoppingCartEdit = [];
            this.detail = true;

        },
        formatShopping(){
            console.log(this.shoppingCartEdit);
            for(var r = 0; r < this.shoppingCartEdit.length; r++){
                var attributes = [];
                for(var a = 0; a < this.shoppingCartEdit[r].pre_orders[0].item.attributes.length; a++){
                    var at = this.shoppingCartEdit[r].pre_orders[0].item.attributes[a].attribute[0];
                    at.value = this.shoppingCartEdit[r].pre_orders[0].item.attributes[a].value ? this.shoppingCartEdit[r].pre_orders[0].item.attributes[a].value : "";
                    var c = this.shoppingCartEdit[r].pre_orders[0].item.product.attributes.find(element=>{return element.code == this.shoppingCartEdit[r].pre_orders[0].item.attributes[a].attribute[0]._id});
                    at.custom = c && !c.customizable ? true : false;
                    attributes.push(at);
                }
                this.shoppingCartEdit[r].attributes = attributes;
                this.shoppingCartEdit[r].quantity = this.shoppingCartEdit[r].pre_orders[0].item.quantity;
                this.shoppingCartEdit[r].text = this.shoppingCartEdit[r].pre_orders[0].item.product.name;
                this.shoppingCartEdit[r].delivery_place = this.formatList(this.customer.delivery_places, 'name', 'id', 'unit_name').find(element=>{return element.value == this.shoppingCartEdit[r].pre_orders[0].delivery_place.id});
                this.shoppingCartEdit[r].product_id = this.shoppingCartEdit[r].pre_orders[0].item.product._id;
                this.shoppingCartEdit[r].sub_product = this.shoppingCartEdit[r].pre_orders[0].item.sub_product;
                this.shoppingCartEdit[r].customer_id = this.customer._id;
                this.shoppingCartEdit[r]._id = this.shoppingCartEdit[r].pre_orders[0]._id;
            }
        },
        groupDay(obj, product){
            var re = false;
            var days = [];
            var  idx = "";
            for(var r = 0; r < this.shoppingCartEdit.length; r++){
                if(this.shoppingCartEdit[r].pre_orders && this.shoppingCartEdit[r].pre_orders[0].item.product._id == obj.item.product._id){
                    days = this.shoppingCartEdit[r].pre_orders[0].days;
                    days.push(obj.days);
                    re = true;
                    idx = r;
                    break;
                }

            }
            if(!re){
                obj.days = [obj.days];
                obj._id = obj._id._id;
                this.shoppingCartEdit.push({"pre_orders":[obj]});
            }else{
                return {"pos":idx, "days":days};
            }
        },
        formarDay(day){
            var name = "";
            if(day.length > 0){
                day = day && day[0].days || day[0].days == 0 ? day[0].days : "";
                switch(day){
                    case 0: name = "Domingo"; break;
                    case 1: name = "Lunes"; break;
                    case 2: name = "Martes"; break;
                    case 3: name = "Miercoles"; break;
                    case 4: name = "Jueves"; break;
                    case 5: name = "Viernes"; break;
                    case 6: name = "Sabado"; break;
                }
            }
            return name == "" ? "No hay" : name;
        },
        formatList(list, name, code, secondName = ""){
            var lst = [];
            if(list){
                for(var s = 0; s < list.length; s++){
                    var text = list[s][name];
                    if(secondName!="")text+= " "+list[s][secondName];
                    lst.push({"text":text, "value":list[s][code]});
                }
            }
            return lst;
        },
        valAttr(attributes, attributesExist){
            var r = true;
            for(var r = 0; r < attributes.length; r++){
                for(var s = 0; s < attributesExist.length; s++){
                    if( (attributes[r].code == attributesExist[s].code) && attributes[r].value != attributesExist[s].value ){
                        r = false;
                        break;
                    }
                }
                if(!r)
                    break;
            }
            return r;
        },  
        validateRepeat(){
            var r = false;
            for(var s = 0; s < this.shoppingCart.length; s++){
                if( this.valAttr(this.product.attributes, this.shoppingCart[s].attributes) ){
                    this.product.quantity = !this.product.quantity ? 1 : this.product.quantity;
                    this.shoppingCart[s].quantity = Number(this.shoppingCart[s].quantity) + Number(this.product.quantity);
                    r = true;
                    break;
                }
            }
            return r;
        },
        addArray(arr, inside = false, idx){
            if(arr){
                switch(arr){
                    case "p":
                        this.product.customer_id = this.customer_id;
                        this.product.attributes = [...this.attributes];
                        this.product.days = [];
                        this.product.viewAtt = false;
                        console.log(this.product);
                        var obj={
                                    "delivery_place":this.preOrder.deliveryPlace, "attributes":this.product.attributes, "categories":this.product.categories, "class":this.product.class, "customer_id":this.product.customer_id,
                                    "days":this.product.days, "price":this.product.price, "principal_value":this.product.principal_value, "product_id":this.product.product_id,
                                    "quantity":this.product.quantity, "sub_product":this.product.sub_product, "sub_value":this.product.sub_value, "text":this.product.text,
                                    "unit_value":this.product.price, "viewAtt":this.product.viewAtt,
                                };
                        if(!inside){
                            this.productsCart.push(obj);
                            this.preOrder.finish = true;
                            this.productsCart.push();
                        }else{
                            var prds = this.shoppingCart[idx].productsCart;
                            prds.push(obj);
                            this.shoppingCart[idx].productsCart = prds;
                            this.shoppingCart[idx].addProduct = false;
                            this.shoppingCart.push();
                        }
                        this.product = "";
                        this.attributes = [];
                        this.attributes.push();
                        this.fetchProducts();
                        break;
                    case "cart":
                        this.shoppingCart.push({
                            "index":idxp, "name":this.preOrder.name, "delivery_place":this.preOrder.deliveryPlace, "hour":this.preOrder.hour,
                            "productsCart":this.productsCart, "addProduct":false
                        });
                        var idxp = this.shoppingCart.length == 1 ? 0 : this.shoppingCart.length - 1;
                        this.shoppingCart[idxp].index = idxp;
                        this.preOrder.finish = false;
                        this.preOrder.name = "";
                        this.preOrder.deliveryPlace = "";
                        this.preOrder.hour = "";
                        this.productsCart = [];
                        break;
                }
            }
        },
        removeArray(opc, arr, idx, idx2 = ""){
            switch(opc){
                case "p":
                    console.log("llegue aca : index: "+idx+" al que voy : "+idx2);
                    var prds = this.shoppingCart[idx].productsCart;
                    prds.splice(idx2, 1);
                    this.shoppingCart[idx].productsCart = prds;
                    this.shoppingCart.push();
                    break;
                case "g":
                    this[arr].splice(idx, 1); 
                    if(arr == "productsCart" && this[arr].length == 0){
                        this.preOrder.finish = false;
                    }
                    this[arr].push();
                    break;
            }
        },
        replaceValue(attrs){
            for(var s = 0; s < this.attributes.length; s++){
                for(var r = 0; r < attrs.length; r++){
                    if(this.attributes[s]._id == attrs[r].code){
                        this.attributes[s].value = attrs[r].value && attrs[r].value.value ? attrs[r].value.value : attrs[r].value;
                        this.attributes[s].custom = !attrs[r].customizable ? true : false;
                    }

                }
            }
        },
        formatAttributes(lst){
            var list = [];
            for(var r = 0; r < lst.length; r++){
                list.push({"attribute":lst[r]._id, "value":lst[r].value && lst[r].value.value ? lst[r].value.value : lst[r].value });
            }
            return list;
        },
        day(name){
            var r = "";
            switch(name){
                case "lunes": r = 1; break;
                case "martes": r = 2; break;
                case "miercoles": r = 3; break;
                case "jueves": r = 4; break;
                case "viernes": r = 5; break;
                case "sabado": r = 6; break;
                case "domingo": r = 0; break;
            }
            return r;
        },
        buildPreOrder(){
            var json = [];
            for(var r = 0; r < this.shoppingCart.length; r++){
                //Recupero días
                var days = [];
                for(var g = 0; g < this.shoppingCart[r].productsCart.length; g++){
                    var week = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];  
                    for(var s = 0; s < week.length; s++){
                        if(this.shoppingCart[r].productsCart[g][week[s]] && this.shoppingCart[r].productsCart[g][week[s]] == true){
                            var d = this.day(week[s]);
                            if(d != "")
                                days.push(d);
                        }
                    }

                    var item = {
                        "product": this.shoppingCart[r].productsCart[g].product_id,
                        "sub_product": this.shoppingCart[r].productsCart[g].sub_product,
                        "attributes": this.formatAttributes(this.shoppingCart[r].productsCart[g].attributes),
                        "unit_value": this.shoppingCart[r].productsCart[g].unit_value,
                        "quantity": this.shoppingCart[r].productsCart[g].quantity,
                    };
                    var place = this.shoppingCart[r].productsCart[g].delivery_place && this.shoppingCart[r].productsCart[g].delivery_place.value ? this.shoppingCart[r].productsCart[g].delivery_place.value : this.shoppingCart[r].productsCart[g].delivery_place;
                    json.push({"group_name":this.shoppingCart[r].name, "days":days, "item":item, "delivery_place":place, "customer":this.shoppingCart[r].productsCart[g].customer_id});
                }
            }
            console.log(json)
            return json;
        },
        processPreOrder () {
            this.create(this.buildPreOrder()).then(
                data => {
                    this.setWarning(data, { root: true }).then(()=>{
                        //this.fetchPreOrdersCustomer(this.customer_id);
                        this.$router.push('/customerDetail/'+this.customer_id)
                    })
                },
                error => {
            });
        },
        redirect(page){
            if(page){
                this.$router.push('/customerDetail/'+this.customer_id)
            }else{
                this.$router.push('/customerList')
            }
        }
    },
    computed:{
        ...mapState({
            prds: state => state.product.products,
            warning: state => state.warning,
            customer: state => state.customer.customer,
            preOrders: state => state.preOrder.preOrders,
        }),
        trySend(){
            if(this.shoppingCart.length > 0 || this.preOrders.length > 0){
                return false; 
            }
            return true;
        }
    },
  }
</script>

