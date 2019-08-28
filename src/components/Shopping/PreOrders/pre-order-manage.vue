<template>
    <v-container>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 md12>
                <v-card class="elevation-12">
                <v-toolbar dark color="primary">
                    <v-toolbar-title>Pre ordenes</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="redirect(true)">Cancelar</v-btn>
                </v-toolbar>
                <v-card-text>
                    <v-form>
                        <v-card class="pa-2" outlined tile>
                            <v-layout row wra>
                                <v-flex xs12 md12>
                                    <h2>Productos <v-icon medium @click="addProduct ? addProduct = false : addProduct = true">add</v-icon></h2>
                                    <div row wra v-if="addProduct">
                                        <v-layout row wra>                    
                                            <v-flex xs12 md4>
                                                <v-combobox prepend-icon="filter_list" v-model="product" :items="products" label="Producto"></v-combobox>
                                            </v-flex>  
                                            <v-flex xs12 md4>
                                                <v-text-field v-model="product.quantity" prepend-icon="library_books" name="title" label="Cantidad" type="number"></v-text-field>
                                            </v-flex>  
                                            <v-flex xs12 md6>
                                                <v-text-field :disabled="true" v-model="product.unit_value" prepend-icon="library_books" name="title" label="Precio" type="text"></v-text-field>
                                            </v-flex>        
                                        </v-layout>
                                        <v-layout row wra>
                                            <div v-for="(attr, index) in attributes" :key="index+'_'+attr.code">
                                                <div v-if="attr.options && attr.options.length > 0">
                                                    <v-flex xs12 md12>
                                                        <v-combobox :disabled="attr.custom" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" :items="formatList(attr.options, 'code', '_id')" prepend-icon="filter_list" :label="attr.code"></v-combobox>
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
                                        </v-layout>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="primary" @click="addArray('p')">Agregar al carrito</v-btn>
                                        </v-card-actions>
                                        
                                    </div>
                                </v-flex>
                            </v-layout>
                        </v-card><br>
                        <v-card class="pa-2" outlined tile>
                            <h1>Pre compra</h1><hr><br>
                            <div v-for="(sc, index) in shoppingCart">
                                <v-layout row wra>
                                    <v-flex xs12 md1>
                                        <v-text-field :disabled="true" v-model="sc.quantity" name="quantity" label="Cantidad" type="number"></v-text-field>
                                    </v-flex> 
                                    <v-flex xs12 md2>
                                        <v-combobox :disabled="true" prepend-icon="filter_list" v-model="sc.text" label="Producto"></v-combobox>
                                        <div v-for="(attr, index) in sc.attributes" :key="index+'_'+attr.code" class="row col-md-8">
                                            <div v-if="attr.options && attr.options.length > 0">
                                                <v-combobox  :disabled="attr.custom" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" :items="formatList(attr.options, 'code', '_id')" prepend-icon="filter_list" :label="attr.code"></v-combobox>
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
                                    </v-flex>
                                    <v-flex xs12 md10>
                                        <v-layout justify-center row wra>
                                            <v-flex xs12 md2 cols="12" sm="4" md="2">
                                                <v-checkbox @click="updateArray(index, 1,)" label="Lunes"></v-checkbox>
                                            </v-flex>
                                            <v-flex xs12 md2 cols="12" sm="4" md="2">
                                                <v-checkbox @click="updateArray(index, 2,)" label="Martes"></v-checkbox>
                                            </v-flex>
                                            <v-flex xs12 md2 cols="12" sm="4" md="2">
                                                <v-checkbox @click="updateArray(index, 3,)" label="Miercoles"></v-checkbox>
                                            </v-flex>
                                            <v-flex xs12 md2 cols="12" sm="4" md="2">
                                                <v-checkbox @click="updateArray(index, 4,)" label="Jueves"></v-checkbox>
                                            </v-flex>
                                            <v-flex xs12 md2 cols="12" sm="4" md="2">
                                                <v-checkbox @click="updateArray(index, 5,)" label="Viernes"></v-checkbox>
                                            </v-flex>
                                            <v-flex xs12 md2 cols="12" sm="4" md="2">
                                                <v-checkbox @click="updateArray(index, 6,)" label="Sabados"></v-checkbox>
                                            </v-flex>
                                            <v-flex xs12 md2 cols="12" sm="4" md="2">
                                                <v-checkbox @click="updateArray(index, 0,)" label="Domingos"></v-checkbox>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs12 md1>
                                        <v-icon medium @click="removeArray('shoppingCart', index)">close</v-icon></v-chip>
                                    </v-flex>
                                </v-layout>
                                <v-layout row wra>
                                    <v-combobox prepend-icon="filter_list" v-model="sc.delivery_place" :items="formatList(customer.delivery_places, 'name', '_id', 'unit_name')" label="Lugares de entrega"></v-combobox>
                                </v-layout><hr><br>
                            </div>
                        </v-card><br>
                        <v-layout row wra>
                            <v-flex v-for="day in days" xs12 sm12 md2>
                                <v-card class="mx-auto">
                                    <v-card-title><h3>{{day.day}}</h3></v-card-title>
                                    <v-card-text>
                                        <div>Productos</div>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-btn text color="primary">Editar</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-form>   
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" style="width:100%" @click="processPreOrder()">Guardar</v-btn>
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
</style>
<script>
  import {mapActions,mapState} from 'vuex';
  
  export default {
    name: 'preo-order',
    data () {
        return {
            deliveryPlace:"",
            deliveryPlaces:[],
            customer_id:"",
            addProduct:false,
            quantity:0,
            shoppingCart:[],
            week:[],
            days:[
                {"day":"Lunes"},
                {"day":"Martes"},
                {"day":"Miercoles"},
                {"day":"Jueves"},
                {"day":"Viernes"},
                {"day":"Sabado"},
                {"day":"Domingo"},
            ],
            product:"",
            products:[],
            attributes:[],
        }
    },
    watch:{
        prds(val){
            if(val){
                this.products = [];
                for(var s = 0; s < val.length; s++){
                    if(val[s].status == "enable")
                        this.products.push({"text":val[s].name, "value":val[s]._id, "attributes":val[s].attributes, "categories":val[s].categories, "class":val[s].product_class, "price":val[s].price});
                }
            }
        },
        product(val){
            if(val){
                this.product.product_id = val.value;
                this.product.unit_value = val.price;
                this.attributes = [];
                this.attributes = val.class.attributes;
                this.attributes = this.attributes.concat(val.class.order_attributes);
                this.replaceValue(val.attributes);
            }
        },
    },
    mounted () {
        this.fetchProducts();
        this.customer_id = this.$route.params.id == undefined ? 0 : this.$route.params.id;
        if(!this.customer)
            this.getCustomer(this.customer_id);
    },
    methods: {
        ...mapActions({
            create: 'order/create',
            fetchProducts: 'product/fetchProducts',
            getCustomer: 'customer/getCustomer', 
            setWarning: 'setWarning',
        }),
        updateArray(idx, val){
            var days = [];
            days = this.shoppingCart[idx].days;
            var p = days.indexOf(val);
            if(p < 0){
                days.push(val);
            }else{
                days.splice(p, 1); 
            }
            this.shoppingCart[idx].days = days;
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
        addArray(arr, obj){
            this.product.customer_id = this.customer_id;
            if(arr){
                switch(arr){
                    case "p":
                        this.product.attributes = this.attributes;
                        this.product.days = [];
                        this.shoppingCart.push(this.product);
                        this.product = "";
                        this.attributes = [];
                        break;
                    case "d":
                        this.deliveryPlaces.push(this[obj]);
                        console.log(this.deliveryPlaces);
                        this[obj] = "";
                        break;
                }
            }
        },
        removeArray(arr, idx){
            this[arr].splice(idx, 1); 
        },
        replaceValue(attrs){
            for(var s = 0; s < this.attributes.length; s++){
                for(var r = 0; r < attrs.length; r++){
                    if(this.attributes[s]._id == attrs[r].code){
                        this.attributes[s].value = attrs[r].value;
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
        buildPreOrder(){
            var json = [];
            for(var r = 0; r < this.shoppingCart.length; r++){
                console.log(this.shoppingCart[r]);
                var item = {
                    "product": this.shoppingCart[r].product_id,
                    "product_attributes": this.formatAttributes(this.shoppingCart[r].attributes),
                    "unit_value": this.shoppingCart[r].unit_value,
                    "quantity": this.shoppingCart[r].quantity,
                };
                json.push({"days":this.shoppingCart[r].days, "item":item, "delivery_place":this.shoppingCart[r].delivery_place.value, "customer":this.shoppingCart[r].customer_id});
            }
            console.log(json)
            return json;
        },
        processPreOrder () {
            this.create(this.buildPreOrder()).then(
                data => {
                    this.setWarning(data, { root: true }).then(()=>{
                        this.redirect(true);
                    })
                },
                error => {
            })
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
      }),
    },
  }
</script>

