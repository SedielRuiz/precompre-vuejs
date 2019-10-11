<template>
    <v-container>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 md12>
                <v-card class="elevation-12">
                <v-toolbar dark color="primary">
                    <v-toolbar-title>Orden {{group_name}}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="redirect(true)">Cancelar</v-btn>
                </v-toolbar>
                <v-card-text>
                    <v-form>
                        <v-alert :value="customer && customer.delivery_places && customer.delivery_places.length == 0" type="info">Este cliente no tiene lugares de entrega.</v-alert>
                        <v-combobox prepend-icon="filter_list" v-if="!this.$route.params.id" v-model="customer_id" :items="customers" label="Cliente"></v-combobox>
                        <v-card v-if="customer_id" class="pa-2" outlined tile>
                            <h3>Datos orden</h3>
                            <v-layout row wrap>
                                <v-flex xs12 md6>
                                    <v-combobox prepend-icon="filter_list" v-model="order.deliveryPlace" :items="formatList(customer.delivery_places, 'name', '_id', 'unit_u')" label="Lugares de entrega"></v-combobox>
                                </v-flex>
                                <v-flex xs12 md6>
                                    <v-combobox prepend-icon="filter_list" v-model="order.hour" :items="hours" label="Hora"></v-combobox>
                                </v-flex>
                            </v-layout><br>
                            <h3>Producto orden</h3>
                            <v-layout row wrap>
                                <v-flex xs12 md4>
                                    <v-combobox prepend-icon="filter_list" v-model="product" :items="products" label="Producto"></v-combobox>
                                </v-flex>  
                                <v-flex xs12 md4>
                                    <v-text-field v-model="item.quantity" prepend-icon="library_books" name="title" label="Cantidad" type="number"></v-text-field>
                                </v-flex>  
                                <v-flex xs12 md4>
                                    <v-text-field readonly v-model="item.price" prepend-icon="library_books" name="title" label="Precio unitario" type="text"></v-text-field>
                                </v-flex>        
                            </v-layout>
                            <v-layout row wrap>
                                <div v-for="(attr, index) in attributes" :key="index+'_'+attr.code+'_other'" v-if="(attr.custom && attr.variable) || (!attr.custom && attr.variable == false) || !attr.custom && !attr.pivot">
                                    <div v-if="attr.visible && attr.code != 'photo'">
                                        <div v-if="attr.options && attr.options.length > 0">
                                            <v-flex xs12 md12>
                                                <v-select :disabled="attr.custom" @input="findPrice('g')" v-on:change="findPrice('g')" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = (attr.default_value ? attr.default_value : ' ') : attr.value" :items="formatList(attr.options, 'code', 'code')" prepend-icon="filter_list" :label="attr.code"></v-select>
                                            </v-flex>
                                        </div>
                                        <div v-else>
                                            <div v-if="attr.type == 'boolean'">
                                                <v-flex xs12 md12>
                                                    <v-switch :disabled="attr.custom" :key="index+'_'+attr.code" prepend-icon="title" v-model="!attr.value && attr.value != ''? attr.value = (attr.default_value ? attr.default_value : ' ') : attr.value" :label="attr.code"></v-switch>
                                                </v-flex>
                                            </div>
                                            <div v-else>
                                                <div v-if="attr.size == 'short'">
                                                    <v-flex xs12 md12>
                                                        <v-text-field :disabled="attr.custom" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = (attr.default_value ? attr.default_value : ' ') : attr.value" prepend-icon="library_books" name="title" :label="attr.code" :type="attr.type"></v-text-field>
                                                    </v-flex>
                                                </div>
                                                <div v-else-if="attr.size == 'medium'">
                                                    <v-flex xs12 md12>
                                                        <v-textarea :disabled="attr.custom" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = (attr.default_value ? attr.default_value : ' ') : attr.value" prepend-icon="library_books" height="77px" name="mediumText" :label="attr.code"></v-textarea>
                                                    </v-flex>
                                                </div>
                                                <div v-else>
                                                    <v-flex xs12 md12>
                                                        <v-textarea :disabled="attr.custom" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = (attr.default_value ? attr.default_value : ' ') : attr.value" prepend-icon="library_books" height="135px" name="mediumText" :label="attr.code"></v-textarea>
                                                    </v-flex>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </v-layout>
                            <label v-if="attributes.length > 0" style="font-size:15px;">Atributos </label><br>
                            <v-layout row wrap v-if="attributes">
                                <div v-for="(attr, index) in attributes" :key="index+'_'+attr.code">
                                    <div v-if="attr.visible && attr.code != 'photo' && (!attr.custom && attr.pivot)">
                                        <div v-if="attr.options && attr.options.length > 0">
                                            <v-flex xs12 md12>
                                                <v-combobox :disabled="attr.custom" @change="findPrice('g')" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = (attr.default_value ? attr.default_value : ' ') : attr.value" :items="formatList(attr.options, 'code', 'code')" prepend-icon="filter_list" :label="attr.code"></v-combobox>
                                            </v-flex>
                                        </div>
                                        <div v-else>
                                            <div v-if="attr.type == 'boolean'">
                                                <v-flex xs12 md12>
                                                    <v-switch :disabled="attr.custom" :key="index+'_'+attr.code" prepend-icon="title" v-model="!attr.value && attr.value != ''? attr.value = (attr.default_value ? attr.default_value : ' ') : attr.value" :label="attr.code"></v-switch>
                                                </v-flex>
                                            </div>
                                            <div v-else>
                                                <div v-if="attr.size == 'short'">
                                                    <v-flex xs12 md12>
                                                        <v-text-field :disabled="attr.custom" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = (attr.default_value ? attr.default_value : ' ') : attr.value" prepend-icon="library_books" name="title" :label="attr.code" :type="attr.type"></v-text-field>
                                                    </v-flex>
                                                </div>
                                                <div v-else-if="attr.size == 'medium'">
                                                    <v-flex xs12 md12>
                                                        <v-textarea :disabled="attr.custom" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = (attr.default_value ? attr.default_value : ' ') : attr.value" prepend-icon="library_books" height="77px" name="mediumText" :label="attr.code"></v-textarea>
                                                    </v-flex>
                                                </div>
                                                <div v-else>
                                                    <v-flex xs12 md12>
                                                        <v-textarea :disabled="attr.custom" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = (attr.default_value ? attr.default_value : ' ') : attr.value" prepend-icon="library_books" height="135px" name="mediumText" :label="attr.code"></v-textarea>
                                                    </v-flex>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </v-layout>
                            <v-layout row wrap>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" :disabled="item.quantity && item.price ? false : true" @click="addArray('p')">Agregar producto</v-btn>
                            </v-layout><br>
                            <h2>Vista previa</h2><hr><br>
                            <div v-if="productsCart.length > 0">
                                <v-layout align-center row wrap>
                                    <v-flex xs12 md4>
                                        <label class="text">Producto</label>
                                    </v-flex>
                                    <v-flex xs12 md2>
                                        <label class="text">Cantidad</label>
                                    </v-flex> 
                                    <v-flex xs12 md3>
                                        <label class="text">Precio</label>
                                    </v-flex>
                                    <v-flex xs12 md2>
                                        <label class="text">Eliminar</label>
                                    </v-flex>
                                </v-layout><br>
                                <div v-for="(prd, index) in productsCart" :key="index">
                                    <v-layout align-center row wrap>
                                        <v-flex xs6 md4>
                                            <label>{{prd.name}}</label>
                                        </v-flex>
                                        <v-flex xs6 md2>
                                            <label>{{prd.quantity}}</label>
                                        </v-flex> 
                                        <v-flex xs6 md3>
                                            <label>$ {{formatMoney(prd.price)}}</label>
                                        </v-flex>
                                        <v-flex xs6 md2>
                                            <v-icon medium @click="removeArray('p', index)">delete</v-icon>
                                        </v-flex>
                                    </v-layout><br>
                                </div>
                            </div>
                        </v-card><br>
                    </v-form>   
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" :disabled="trySend" style="width:100%" @click="processOrder()">Confirmar orden</v-btn>
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

  export default {
    name: 'order',
    data () {
        return {
            hours:[
                {text:"06:00 AM", value:"06:00"},
            ],
            order:{},
            customers:[],
            productsCart:[],
            group_name:"",
            item:{},
            customer_id:"",
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
                    if(val[s].status == "enable"){
                        this.products.push({"text":val[s].name, "sub_products":val[s].sub_products, "principal_value":val[s]._id, "attributes":val[s].attributes, "categories":val[s].categories, "class":val[s].product_class, "price":val[s].default_price});
                    }
                }
            }
        },
        product(val){
            if(val){
                this.product.product_id = val.principal_value;
                this.attributes = val.class.attributes;
                this.attributes = this.attributes.concat(val.class.order_attributes);
                this.replaceValue(val.attributes);
            }
        },
        cutms(val){
            if(val){
                for(var s = 0; s < val.length; s++){
                    this.customers.push({"text":val[s].name+" "+val[s].last_name, value:val[s]._id});
                }
            }
        },
        customer_id(val){
            if(val){
                this.getCustomer(this.customer_id.value ? this.customer_id.value : this.customer_id);
            }
        },
        order(val){
            if(val){
                if(val.hour)
                    this.buildName(val.hour.text);;
            }
        }
    },
    mounted () {
        this.buildName("");
        this.fetchProducts();
        this.fetchCustomers({"page_size":-1});
        this.customer_id = this.$route.params.id == undefined ? "" : this.$route.params.id;
    },
    methods: {
        ...mapActions({
            create: 'order/create',
            delete: 'order/delete',
            fetchProducts: 'product/fetchProducts',
            fetchCustomers: 'customer/fetchCustomers',
            getCustomer: 'customer/getCustomer', 
            setWarning: 'setWarning',
        }),
        formatMoney (n) {
            var num = String(n).replace(/\./g,'');
            if(!isNaN(num)){
                num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
                num = num.split('').reverse().join('').replace(/^[\.]/,'');
            }
            return num;
        },
        buildName(part2){
            let days = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
            var date = new Date();
            date.setDate(date.getDate() + 1);
            this.group_name = days[date.getDay()]+ " " + ( (date.getDate()) < 10 ? "0"+(date.getDate()) : (date.getDate()))+" "+part2;
        },
        calculatePrice(idx, idx2){
            this.shoppingCart[idx].productsCart[idx2].price = this.shoppingCart[idx].productsCart[idx2].price_base * this.shoppingCart[idx].productsCart[idx2].quantity;
            this.shoppingCart.push();
        },
        findPrice: function(opc, idx = "", idx2 = ""){
            var subss = [];
            var attrs = [];
            this.attributes.push();
            this.productsCart.push();

            subss = this.product.sub_products;
            attrs = this.attributes;
            
            console.log("la opciopn :"+opc);
            console.log(subss);
            console.log(attrs);
            let pivot = true;
            var price = 0;
            for(var r = 0; r < subss.length; r++){
                pivot = true;
                for(var g = 0; g < subss[r].options.length; g++){
                    for(var s = 0; s < attrs.length; s++){
                        if(attrs[s].type != "text" || attrs[s].options.length > 0){
                            var prc = subss[r].options.find(element=>{return element.pivot == attrs[s]._id});
                            if(prc && attrs[s].code != "photo" && attrs[s].code != "recipe"){
                                var valurVal = attrs[s].value && attrs[s].value.value ? attrs[s].value.value : attrs[s].value;
                                if(attrs[s].code == "price"){
                                    price = prc.option;
                                }
                                if(valurVal != prc.option){
                                    if(attrs[s].code != "price"){
                                        pivot = false;
                                        break;
                                    }
                                }

                            }
                        }
                    }
                    if(pivot){
                        break
                    }
                }
                if(pivot){
                    this.product.sub_product = subss[r]._id;
                    break;
                }
            }
            this.item.price = price;
            console.log("precio :"+price);
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
        addArray(arr){
            if(arr){
                switch(arr){
                    case "p":
                        this.product.customer_id = this.customer_id.value ? this.customer_id.value : this.customer_id;
                        this.product.attributes = [...this.attributes];
                        this.product.days = [];
                        this.product.viewAtt = false;
                        var idxp = "";
                        console.log(this.product);
                        var obj={
                            "attributes":this.product.attributes, 
                            "price":this.item.price * this.item.quantity, 
                            "product_id":this.product.product_id,
                            "quantity":this.item.quantity, 
                            "sub_product":this.product.sub_product, 
                            "name":this.product.text,
                        };
                        this.productsCart.push(obj);
                        this.product = "";
                        this.attributes = [];
                        console.log(this.productsCart);
                        this.attributes.push();
                        break;
                }
            }
        },
        removeArray(opc, idx){
            switch(opc){
                case "p":
                    this.productsCart.splice(idx, 1);
                    this.productsCart.push();
                    break;
            }
        },
        replaceValue(attrs){
            for(var s = 0; s < this.attributes.length; s++){
                for(var r = 0; r < attrs.length; r++){
                    if(this.attributes[s].attribute.length > 0 && this.attributes[s].attribute[0]._id == attrs[r].code){
                        this.attributes[s].attribute[0].value = attrs[r].value && attrs[r].value.value ? attrs[r].value.value : attrs[r].value;
                        this.attributes[s].attribute[0].custom = !attrs[r].customizable ? true : false;
                        if(!attrs[r].customizable){
                            this.attributes[s].attribute[0].variable = this.attributes[s].variable;
                        }else{
                            this.attributes[s].attribute[0].pivot = this.attributes[s].pivot;
                        }
                    }

                }
            }
            var atrs = [];
            for(var r = 0; r < this.attributes.length; r++){
                if(this.attributes[r].attribute[0]){
                    atrs.push(this.attributes[r].attribute[0]);
                }
            }
            this.attributes = [];
            this.attributes = atrs;
            this.attributes.push();
            console.log(this.attributes);
        },
        formatAttributes(lst){
            var list = [];
            for(var r = 0; r < lst.length; r++){
                list.push({"attribute":lst[r]._id, "value":lst[r].value && lst[r].value.value ? lst[r].value.value : lst[r].value });
            }
            return list;
        },
        buildOrder(){
            var json = {};
            var items = [];
            for(var r = 0; r < this.productsCart.length; r++){
                var item = {
                    "product": this.productsCart[r].product_id,
                    "sub_product": this.productsCart[r].sub_product,
                    "attributes": this.formatAttributes(this.productsCart[r].attributes),
                    "quantity": this.productsCart[r].quantity,
                };
                items.push(item);
            }
            var date = new Date();
            date.setDate(date.getDate() + 1);
            var place = this.order.deliveryPlace && this.order.deliveryPlace.value ? this.order.deliveryPlace.value : this.order.deliveryPlace;
            json = {
                "customer":this.customer_id && this.customer_id.value ? this.customer_id.value : this.customer_id,
                "state":"cart",
                "delivery_date": (date.getDate() < 10 ? "0"+date.getDate(): date.getDate()) + "/" + ((date.getMonth()+1) < 10 ? "0"+(date.getMonth()+1) : (date.getMonth()+1)) + "/" + date.getFullYear(),
                "delivery_place":place, 
                "items":items, 
            };
            console.log(json)
            return json;
        },
        processOrder () {
            this.create(this.buildOrder()).then(
                data => {
                    this.setWarning(data, { root: true }).then(()=>{
                        //this.fetchPreOrdersCustomer(this.customer_id);
                        this.$router.push('/ordersList')
                    })
                },
                error => {
            });
        },
        redirect(page){
            if(page){
                this.$router.push('/ordersList')
            }else{
                this.$router.push('/ordersList')
            }
        }
    },
    computed:{
        ...mapState({
            prds: state => state.product.products,
            warning: state => state.warning,
            customer: state => state.customer.customer,
            cutms: state => state.customer.customers,
        }),
        trySend(){
            if(this.order && this.order.hour && this.order.deliveryPlace){
                return false; 
            }
            return true;
        }
    },
  }
</script>

