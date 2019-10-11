<template>
    <v-container>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 md12>
                <v-card class="elevation-12">
                <v-toolbar dark color="primary">
                    <v-toolbar-title>Orden {{group_name}}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="deleteOrder(order_id)">Eliminar</v-btn>
                    <v-btn color="error" @click="redirect(true)">Cancelar</v-btn>
                </v-toolbar>
                <v-card-text>
                    <v-form>
                        <v-alert :value="customer && customer.delivery_places && customer.delivery_places.length == 0" type="info">Este cliente no tiene lugares de entrega.</v-alert>
                        <v-card class="pa-2 elevation-0" outlined tile v-if="order.customer">
                            <h2>Datos cliente</h2>
                            <br>
                            <v-layout row wrap>
                                <v-flex xs12 sm6 md4 lg4>
                                    <h4>Nombre</h4>
                                    <label>{{order.customer.name}} {{order.customer.last_name}}</label>
                                </v-flex>
                                <v-flex xs12 sm6 md4 lg4>
                                    <h4>Correo</h4>
                                    <label>{{order.customer.email}}</label>
                                </v-flex>
                                <v-flex xs12 sm6 md4 lg4>
                                  <h4>Telefono</h4>
                                  <label>
                                  {{order.customer.telephones[0].number}}
                                  </label>
                                </v-flex>
                            </v-layout><br>
                            <h2>Datos orden</h2>
                            <v-layout row wrap>
                                <v-flex xs12 md6>
                                    <v-combobox prepend-icon="filter_list" v-model="order.deliveryPlace" :items="formatListD(customer.delivery_places, 'place_name', 'cluster_title', 'unit_u', 'id', '_id')"  label="Lugar de entrega"></v-combobox>
                                </v-flex>
                                <v-flex xs12 md6>
                                    <v-combobox v-model="order.hour" :items="schedules" label="Hora"></v-combobox>
                                </v-flex>
                            </v-layout><br>
                            <div v-if="addProduct">
                              <h3>Adicionar producto</h3>
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
                            </div>
                            <h2>Productos <v-icon medium @click="addProduct=!addProduct">add</v-icon></h2><hr>
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
                        </v-card>
                    </v-form> 
                    <div v-if="order.products">
                      <v-data-table
                        :headers="headers"
                        :items="order.products"
                        hide-actions disable-initial-sort
                        class="elevation-0">
                        <template v-slot:items="props">
                          <td>{{props.item.product.name}}</td>
                          <td>
                            <div v-for="(attr, attr_index) in props.item.attributes[0]" :key="`attr_index${attr_index}`">
                              <div v-for="(att, att_index) in attrs" :key="`att_index${att_index}`">
                                <div v-if="attr && attr.attribute == att._id">
                                  <label style="font-size: 12px;">
                                    <div v-if="attr.value && att.visible && att.code != 'photo'">
                                      {{att.code.charAt(0).toUpperCase() + att.code.slice(1)}}: {{attr.value.charAt(0).toUpperCase() + attr.value.slice(1)}}
                                    </div>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>{{props.item.quantity}}</td>
                          <td>
                            <v-icon style="color:#bf1526;" medium @click="deleteProduct(props.index)">delete</v-icon>
                          </td>
                        </template>
                      </v-data-table>
                    </div>  
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
            productsCart:[],
            group_name:"",
            item:{},
            customer:"",
            product:"",
            products:[],
            attributes:[],
            schedules: [],
            deliveryPlace: "",
            headers: [
              {text:"Producto", value:"product"},
              {text:"Atributos", value:"attributes"},
              {text:"Cantidad", value:"cantidad"},
              {text:"Acciones", value:"actions"},
            ],
            order_date: "",
            addProduct: false
        }
    },
    watch:{
        ord(val){
            if(val){
                this.order = val;
                var ds = val.delivery_date.split("T")[0];
                this.order_date = val.delivery_date.split("T")[0];
                var hour = val.delivery_date.substring(11,16);
                ds = ds.split("-");
                var date = ds[2]+"/"+ds[1]+"/"+ds[0];
                this.order.delivery_date = date;
                this.order.products = val.items; 
                this.customer = val.customer;
                this.order.deliveryPlace = { text: this.order.delivery_place.name + "  " + this.order.delivery_place.unit_u, value: this.order.delivery_place._id, id: this.order.delivery_place.id };
                this.order.hour = {text: hour, value: hour}
            }
        },
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
        },
        deliveryPlace(val){
            if(val){
                this.getHours(val);
            }
        },
    },
    mounted () {/*
        this.buildName("");
        this.customer_id = this.$route.params.id == undefined ? "" : this.$route.params.id;*/
        this.fetchProducts();
        this.fetchRoutes({page_size:-1});
        this.fetchAttributes({page_size:-1});
        this.order_id = this.$route.params.id == undefined ? 0 : this.$route.params.id;
        this.getOrder(this.order_id);
    },
    methods: {
        ...mapActions({
            update: 'order/update',
            delete: 'order/delete',
            fetchProducts: 'product/fetchProducts',
            fetchCustomers: 'customer/fetchCustomers',
            getCustomer: 'customer/getCustomer', 
            setWarning: 'setWarning',            
            fetchAttributes: 'productAttribute/fetchAttributes',
            getOrder: 'order/getOrder',
            setWarning: 'setWarning',
            fetchRoutes: 'route/fetchRoutes',
        }),
        deleteOrder(){
          this.delete(this.order_id).then(data=>{
            this.setWarning(data, { root: true }).then(()=>{
              this.$router.push('/ordersList')
            })
          })
        },
        deleteProduct(index){
          this.order.products.splice(index,1)
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
        getPrice(item){
            var price = 0;
            var qty = item.quantity;
            var obj = this.attrs.find(element=>{return element.code == "price"});
            if(obj){
                price = item.attributes[0].find(element=>{return element.attribute == obj._id}).value;
            }
            return this.formatMoney(price, qty);
        },
        formatListD(list, name, cluster, secondName, code, code2){
            var lst = [];
            if(list){
                for(var s = 0; s < list.length; s++){
                    var text = list[s][name];
                    if(cluster && (list[s][name] != list[s][cluster]))text+= " "+list[s][cluster];
                    if(secondName!="")text+= " "+list[s][secondName];
                    lst.push({"text":text, "value":list[s][code2], "id":list[s][code]});
                }
            }
            return lst;
        },
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
                        this.product.customer_id = this.customer._id;
                        const attributes_prod = this.attributes.map(function(att){return { attribute: att._id, value: att.value && att.value.value ? att.value.value : att.value }})
                        this.product.attributes = [...attributes_prod];
                        this.product.days = [];
                        this.product.viewAtt = false;
                        var idxp = "";
                        var obj={
                            "attributes":[this.product.attributes], 
                            "price":this.item.price * this.item.quantity, 
                            "product_id":this.product.product_id,
                            "product": {
                              name: this.product.text,
                              _id: this.product.product_id
                            },
                            "quantity":this.item.quantity, 
                            "sub_product":this.product.sub_product, 
                            "name":this.product.text,
                        };
                        this.order.products.push(obj);
                        this.product = "";
                        this.attributes = [];
                        this.order.products.push();
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
            for(var r = 0; r < this.order.products.length; r++){
                var item = {
                    "product": this.order.products[r].product_id ? this.order.products[r].product_id : this.order.products[r].product._id,
                    "sub_product": this.order.products[r].sub_product,
                    "attributes": this.order.products[r].attributes[0],
                    "quantity": this.order.products[r].quantity,
                };
                items.push(item);
            }
            var date = new Date();
            date.setDate(date.getDate() + 1);
            console.log(this.order.delivery_place)
            var place = this.order.deliveryPlace && this.order.deliveryPlace.value ? this.order.deliveryPlace.value : this.order.deliveryPlace;
            json = {
                "customer":this.order.customer._id,
                "state":"cart",
                "delivery_date": this.order_date + "T" + this.order.hour.value + ":00.000Z",
                "delivery_place":place, 
                "items":items, 
                _id: this.order._id
            };console.log(json)
            return json;
        },
        processOrder () {
            this.update(this.buildOrder()).then(
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
        },
        getHours(val){
            this.schedules = [];
            for(var s = 0; s < this.routes.length; s++){
                var route = this.routes[s].delivery_places.find(element=>{return element == val.id});
                if(route){
                    for(var r = 0; r < this.routes[s].schedule.length; r++){
                        this.schedules.push({text: this.routes[s].schedule[r], value: this.routes[s].schedule[r]});
                    }
                }
            }
        },
    },
    computed:{
        ...mapState({
            prds: state => state.product.products,
            warning: state => state.warning,
            cutms: state => state.customer.customers,
            warning: state => state.warning,
            ord: state => state.order.order,
            page_size: state => state.order.page_size,
            total_items: state => state.order.total_items,
            total_pages: state => state.order.total_pages,
            attrs: state => state.productAttribute.attributes,
            routes: state => state.route.routes,
        }),
        trySend(){
          console.log(this.order)
            if(this.order && this.order.hour && this.order.deliveryPlace){
                return false; 
            }
            return true;
        }
    },
  }
</script>

