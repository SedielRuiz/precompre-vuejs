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
                        <v-alert :value="customer && customer.delivery_places && customer.delivery_places.length == 0" type="info">Este cliente no tiene lugares de entrega.</v-alert>
                        <v-combobox prepend-icon="filter_list" v-model="customer_id" :items="customers" label="Cliente"></v-combobox>
                        <v-card v-if="customer_id" class="pa-2" outlined tile>
                            <h3>Datos pre orden</h3>
                            <v-layout row wrap>
                                <v-flex xs12 md6>
                                    <v-combobox prepend-icon="filter_list" autocomplete="off" :disabled="preOrder.finish" v-model="deliveryPlace" :items="formatListD(customer.delivery_places, 'place_name', 'cluster_title', 'unit_u', 'id', '_id')" label="Lugares de entrega"></v-combobox>
                                </v-flex>
                                <v-flex xs12 md6>
                                    <v-select prepend-icon="filter_list" autocomplete="off" :disabled="preOrder.finish" v-model="hour" :items="schedules" label="Hora"></v-select>
                                </v-flex>
                            </v-layout><br>
                            <v-text-field :disabled="preOrder.finish" v-model="preOrder.name" placeholder="NF-PR" prepend-icon="library_books" name="title" label="Nombre" type="text"></v-text-field>
                            <h3>Productos pre orden</h3>
                            <v-layout row wrap>
                                <v-flex xs12 md4>
                                    <v-combobox prepend-icon="filter_list" v-model="product" :items="products" label="Producto"></v-combobox>
                                </v-flex>  
                                <v-flex xs12 md4>
                                    <v-text-field v-model="preOrder.quantity" prepend-icon="library_books" name="title" label="Cantidad" type="number"></v-text-field>
                                </v-flex>  
                                <v-flex xs12 md4>
                                    <v-text-field :disabled="true" v-model="product.price" prepend-icon="library_books" name="title" label="Precio unitario" type="text"></v-text-field>
                                </v-flex>        
                            </v-layout>
                            <v-layout row wrap>
                                <div v-for="(attr, index) in attributes" :key="index+'_'+attr.code+'_other'"
                                    v-if="attr.hasOwnProperty('custom') && !attr.custom || (attr.custom && attr.variable)">
                                    <div v-if="attr.visible && attr.code != 'photo'">
                                        <div v-if="attr.options && attr.options.length > 0">
                                            <v-flex xs12 md12>
                                                <v-select @input="findPrice('g')" v-on:change="findPrice('g')" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = (attr.default_value ? attr.default_value : ' ') : attr.value" :items="formatList(attr.options, 'code', 'code')" prepend-icon="filter_list" :label="attr.code"></v-select>
                                            </v-flex>
                                        </div>
                                        <div v-else>
                                            <div v-if="attr.type == 'boolean'">
                                                <v-flex xs12 md12>
                                                    <v-switch :key="index+'_'+attr.code" prepend-icon="title" v-model="!attr.value && attr.value != ''? attr.value = (attr.default_value ? attr.default_value : ' ') : attr.value" :label="attr.code"></v-switch>
                                                </v-flex>
                                            </div>
                                            <div v-else>
                                                <div v-if="attr.size == 'short'">
                                                    <v-flex xs12 md12>
                                                        <v-text-field :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = (attr.default_value ? attr.default_value : ' ') : attr.value" prepend-icon="library_books" name="title" :label="attr.code" :type="attr.type"></v-text-field>
                                                    </v-flex>
                                                </div>
                                                <div v-else-if="attr.size == 'medium'">
                                                    <v-flex xs12 md12>
                                                        <v-textarea :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = (attr.default_value ? attr.default_value : ' ') : attr.value" prepend-icon="library_books" height="77px" name="mediumText" :label="attr.code"></v-textarea>
                                                    </v-flex>
                                                </div>
                                                <div v-else>
                                                    <v-flex xs12 md12>
                                                        <v-textarea :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = (attr.default_value ? attr.default_value : ' ') : attr.value" prepend-icon="library_books" height="135px" name="mediumText" :label="attr.code"></v-textarea>
                                                    </v-flex>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </v-layout>
                            <v-layout row wrap>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" :disabled="preOrder.name && deliveryPlace && hour ? false : true" @click="addArray('p')">Agregar producto</v-btn>
                            </v-layout><br>
                            <h3 v-if="productsCart.length > 0">Programa tu semana</h3><br>
                            <div v-for="(sc, index) in productsCart">
                                <v-layout align-center row wrap>
                                    <v-flex xs12 md1>
                                        <v-text-field v-model="sc.quantity" name="quantity" label="Cantidad" type="number"></v-text-field>
                                    </v-flex> 
                                    <v-flex xs12 md2>
                                        <v-combobox :disabled="true" prepend-icon="filter_list" v-model="sc.text" label="Producto"></v-combobox>
                                    </v-flex>
                                    <v-flex xs12 md1>
                                        <v-icon medium @click="sc.viewAtt ? sc.viewAtt = false : sc.viewAtt = true">add</v-icon>
                                    </v-flex>
                                    <v-flex xs12 md1>
                                        <v-text-field :disabled="true" v-model="sc.price" name="price" label="Precio" type="number"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 md6>
                                        <v-layout justify-center row wrap>
                                            <v-flex>
                                                <label>Lunes</label>
                                                <v-checkbox v-model="sc.lunes"></v-checkbox>
                                            </v-flex>
                                            <v-flex>
                                                <label>Martes</label>
                                                <v-checkbox v-model="sc.martes"></v-checkbox>
                                            </v-flex>
                                            <v-flex>
                                                <label>Miercoles</label>
                                                <v-checkbox v-model="sc.miercoles"></v-checkbox>
                                            </v-flex>
                                            <v-flex>
                                                <label>Jueves</label>
                                                <v-checkbox v-model="sc.jueves"></v-checkbox>
                                            </v-flex>
                                            <v-flex>
                                                <label>Viernes</label>
                                                <v-checkbox v-model="sc.viernes"></v-checkbox>
                                            </v-flex>
                                            <v-flex>
                                                <label>Sabados</label>
                                                <v-checkbox v-model="sc.sabado"></v-checkbox>
                                            </v-flex>
                                            <v-flex>
                                                <label>Domingos</label>
                                                <v-checkbox v-model="sc.domingo"></v-checkbox>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex align-center  xs12 md1>
                                        <v-layout justify-center row wrap>
                                            <v-icon medium @click="removeArray('g', 'productsCart', index)">close</v-icon></v-chip>
                                        </v-layout>
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <div v-if="sc.viewAtt">
                                        <v-layout row wrap>
                                            <div v-for="(attr, index) in sc.attributes" :key="index+'_'+attr.code+'_other'"
                                                v-if="attr.hasOwnProperty('custom') && !attr.custom || (attr.custom && attr.variable)">
                                                <div v-if="attr.visible && attr.code != 'photo'">
                                                    <div v-if="attr.options && attr.options.length > 0">
                                                        <v-flex xs12 md12>
                                                            <v-select @change="findPrice('e', sc.index)" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = (attr.default_value ? attr.default_value : ' ') : attr.value" :items="formatList(attr.options, 'code', 'code')" prepend-icon="filter_list" :label="attr.code"></v-select>
                                                        </v-flex>
                                                    </div>
                                                    <div v-else>
                                                        <div v-if="attr.type == 'boolean'">
                                                            <v-flex xs12 md12>
                                                                <v-switch :key="index+'_'+attr.code" prepend-icon="title" v-model="!attr.value && attr.value != ''? attr.value = (attr.default_value ? attr.default_value : ' ') : attr.value" :label="attr.code"></v-switch>
                                                            </v-flex>
                                                        </div>
                                                        <div v-else>
                                                            <div v-if="attr.size == 'short'">
                                                                <v-flex xs12 md12>
                                                                    <v-text-field :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = (attr.default_value ? attr.default_value : ' ') : attr.value" prepend-icon="library_books" name="title" :label="attr.code" :type="attr.type"></v-text-field>
                                                                </v-flex>
                                                            </div>
                                                            <div v-else-if="attr.size == 'medium'">
                                                                <v-flex xs12 md12>
                                                                    <v-textarea :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = (attr.default_value ? attr.default_value : ' ') : attr.value" prepend-icon="library_books" height="77px" name="mediumText" :label="attr.code"></v-textarea>
                                                                </v-flex>
                                                            </div>
                                                            <div v-else>
                                                                <v-flex xs12 md12>
                                                                    <v-textarea :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = (attr.default_value ? attr.default_value : ' ') : attr.value" prepend-icon="library_books" height="135px" name="mediumText" :label="attr.code"></v-textarea>
                                                                </v-flex>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </v-layout>
                                    </div>
                                </v-layout>
                            </div><br>
                             <v-layout row wrap>
                                <v-btn style="width:100%" :disabled="productsCart.length == 0 ? true : false" color="primary" @click="addArray('cart')">Agregar pre orden</v-btn>
                            </v-layout><br>
                        </v-card><br>
                        <div v-if="shoppingCart && shoppingCart.length > 0">
                            <h2>Pre ordenes</h2><hr><br>
                            <div v-for="(sh, index) in shoppingCart" :key="index">
                                <v-card class="pa-2" outlined tile >
                                    <v-layout row wrap>
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
                                        <v-layout row wrap>
                                            <v-flex xs12 md4>
                                                <v-combobox prepend-icon="filter_list" v-model="product" :items="products" label="Producto"></v-combobox>
                                            </v-flex>  
                                            <v-flex xs12 md4>
                                                <v-text-field v-model="preOrder.quantity" prepend-icon="library_books" name="title" label="Cantidad" type="number"></v-text-field>
                                            </v-flex>  
                                            <v-flex xs12 md4>
                                                <v-text-field :disabled="true" v-model="product.price" prepend-icon="library_books" name="title" label="Precio" type="text"></v-text-field>
                                            </v-flex>  
                                            <v-flex xs12 md2>
                                                <v-btn color="primary" :disabled="!product ? true : false" @click="addArray('p', true, index)">Agregar</v-btn>
                                            </v-flex>        
                                        </v-layout>
                                        <v-layout row wrap v-if="attributes">
                                            <div v-for="(attr, index) in attributes" :key="index+'_'+attr.code" 
                                                v-if="attr.hasOwnProperty('custom') && !attr.custom || (attr.custom && attr.variable)">
                                                <div v-if="attr.visible && attr.code != 'photo'">
                                                    <div v-if="attr.options && attr.options.length > 0">
                                                        <v-flex xs12 md12>
                                                            <v-combobox @change="findPrice('g')" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = (attr.default_value ? attr.default_value : ' ') : attr.value" :items="formatList(attr.options, 'code', 'code')" prepend-icon="filter_list" :label="attr.code"></v-combobox>
                                                        </v-flex>
                                                    </div>
                                                    <div v-else>
                                                        <div v-if="attr.type == 'boolean'">
                                                            <v-flex xs12 md12>
                                                                <v-switch :key="index+'_'+attr.code" prepend-icon="title" v-model="!attr.value && attr.value != ''? attr.value = (attr.default_value ? attr.default_value : ' ') : attr.value" :label="attr.code"></v-switch>
                                                            </v-flex>
                                                        </div>
                                                        <div v-else>
                                                            <div v-if="attr.size == 'short'">
                                                                <v-flex xs12 md12>
                                                                    <v-text-field :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = (attr.default_value ? attr.default_value : ' ') : attr.value" prepend-icon="library_books" name="title" :label="attr.code" :type="attr.type"></v-text-field>
                                                                </v-flex>
                                                            </div>
                                                            <div v-else-if="attr.size == 'medium'">
                                                                <v-flex xs12 md12>
                                                                    <v-textarea :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = (attr.default_value ? attr.default_value : ' ') : attr.value" prepend-icon="library_books" height="77px" name="mediumText" :label="attr.code"></v-textarea>
                                                                </v-flex>
                                                            </div>
                                                            <div v-else>
                                                                <v-flex xs12 md12>
                                                                    <v-textarea :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = (attr.default_value ? attr.default_value : ' ') : attr.value" prepend-icon="library_books" height="135px" name="mediumText" :label="attr.code"></v-textarea>
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
                                        <v-layout align-center row wrap>
                                            <v-flex xs12 md1>
                                                <v-text-field v-model="sc.quantity" @change="calculatePrice(sh.index, index)" name="quantity" label="Cantidad" type="number"></v-text-field>
                                            </v-flex> 
                                            <v-flex xs10 md3>
                                                <v-combobox :disabled="true" prepend-icon="filter_list" v-model="sc.text" label="Producto"></v-combobox>
                                            </v-flex>
                                            <v-flex xs2 md1>
                                                <v-icon medium @click="sc.viewAtt ? sc.viewAtt = false : sc.viewAtt = true">add</v-icon>
                                            </v-flex>
                                            <v-flex xs12 md1>
                                                <v-text-field :disabled="true" v-model="sc.price" name="price" label="Precio" type="number"></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 md5>
                                                <v-layout justify-center row wrap>
                                                    <v-flex>
                                                        <label>Lunes</label>
                                                        <v-checkbox v-model="sc.lunes"></v-checkbox>
                                                    </v-flex>
                                                    <v-flex>
                                                        <label>Martes</label>
                                                        <v-checkbox v-model="sc.martes"></v-checkbox>
                                                    </v-flex>
                                                    <v-flex>
                                                        <label>Miercoles</label>
                                                        <v-checkbox v-model="sc.miercoles"></v-checkbox>
                                                    </v-flex>
                                                    <v-flex>
                                                        <label>Jueves</label>
                                                        <v-checkbox v-model="sc.jueves"></v-checkbox>
                                                    </v-flex>
                                                    <v-flex>
                                                        <label>Viernes</label>
                                                        <v-checkbox v-model="sc.viernes"></v-checkbox>
                                                    </v-flex>
                                                    <v-flex>
                                                        <label>Sabados</label>
                                                        <v-checkbox v-model="sc.sabado"></v-checkbox>
                                                    </v-flex>
                                                    <v-flex>
                                                        <label>Domingos</label>
                                                        <v-checkbox v-model="sc.domingo"></v-checkbox>
                                                    </v-flex>
                                                </v-layout>
                                            </v-flex>
                                            <v-flex align-center  xs12 md1>
                                                <v-layout justify-center row wrap>
                                                    <v-icon medium @click="removeArray('p', 'productsCart', sh.index, index)">close</v-icon></v-chip>
                                                </v-layout>
                                            </v-flex>
                                        </v-layout>
                                        
                                        <v-layout justify-center row wrap>
                                            <v-flex xs12 md12>
                                                <div v-if="sc.viewAtt">
                                                    <v-layout row wrap>
                                                        <div v-for="(attr, index) in sc.attributes" :key="index+'_'+attr.code" class="row col-md-8" 
                                                            v-if="attr.hasOwnProperty('custom') && !attr.custom || (attr.custom && attr.variable)">
                                                            <div v-if="attr.visible && attr.code != 'photo'">
                                                                <div v-if="attr.options && attr.options.length > 0">
                                                                    <v-combobox @change="findPrice('p', sh.index, sc.index)" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = (attr.default_value ? attr.default_value : ' ') : attr.value" :items="formatList(attr.options, 'code', 'code')" prepend-icon="filter_list" :label="attr.code"></v-combobox>
                                                                </div>
                                                                <div v-else>
                                                                    <div v-if="attr.type == 'boolean'">
                                                                        <v-switch :key="index+'_'+attr.code" prepend-icon="title" v-model="!attr.value && attr.value != ''? attr.value = (attr.default_value ? attr.default_value : ' ') : attr.value" :label="attr.code"></v-switch>
                                                                    </div>
                                                                    <div v-else>
                                                                        <div v-if="attr.size == 'short'">
                                                                            <v-text-field :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = (attr.default_value ? attr.default_value : ' ') : attr.value" prepend-icon="library_books" name="title" :label="attr.code" type="text"></v-text-field>
                                                                        </div>
                                                                        <div v-else-if="attr.size == 'medium'">
                                                                            <v-textarea :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = (attr.default_value ? attr.default_value : ' ') : attr.value" prepend-icon="library_books" height="77px" name="mediumText" :label="attr.code"></v-textarea>
                                                                        </div>
                                                                        <div v-else>
                                                                            <v-textarea :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = (attr.default_value ? attr.default_value : ' ') : attr.value" prepend-icon="library_books" height="135px" name="mediumText" :label="attr.code"></v-textarea>
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
                                     <v-layout justify-center row wrap>
                                        <v-spacer></v-spacer>
                                        
                                    </v-layout>
                                </v-card><br>
                            </div>
                        </div>
                    </v-form>   
                    <v-btn color="primary" :disabled="trySend" style="width:100%" @click="processPreOrder()">Finalizar</v-btn><br><br><br>
                    <div v-if="preOrders.length > 0 && preOrdersName.length > 0">
                        <h1 style="color:black;">Rutina</h1><hr><br>
                        <v-container class="grey lighten-5 mb-6">
                            <div v-for="pre in preOrdersName">
                                <v-layout no-gutters>
                                    <v-flex>
                                        <h2 style="color:black;">Pre compra: {{pre.name}}</h2><br>
                                        <label class="titlee" v-if="pre.delivery">Lugar de entrega: {{pre.delivery}}</label><br>
                                        <label class="titlee" v-if="pre.hour">Hora: {{pre.hour}}</label>
                                    </v-flex>
                                    <v-flex>
                                        <v-icon style="float: right;" large @click="deletePreOrders(pre)">delete</v-icon>
                                    </v-flex>
                                </v-layout>
                                <hr><br>
                                <v-layout no-gutters>
                                    <v-flex v-for="(day, index) in pre.preOrders" :key="index">
                                        <v-card class="pa-2" outlined tile>
                                            <v-card-title><h4 class="dayT">{{formarDay(day.pre_orders)}}</h4></v-card-title>
                                            <v-card-text>
                                                <h3>Productos </h3><hr><br>
                                                <div v-for="prd in day.pre_orders">
                                                    <div v-if="prd.hasOwnProperty('item')">
                                                        <label class="txt">Nombre: {{prd.item.product.name}}</label><br>
                                                        <label class="txt">Precio: $ {{formatMoney(prd.item.attributes, prd.item.quantity)}} </label><br>
                                                        <label class="txt">Cantidad: {{prd.item.quantity}}</label><br><br>
                                                        <div style="text-align:right">
                                                            <!--label v-if="prd.delivery_place">Lugar de entrega : {{prd.delivery_place.place_name}} - {{prd.delivery_place.cluster_title}} - {{prd.delivery_place.unit_u}}</label><br-->
                                                            <v-icon medium @click="editPreOrder(index, prd)">edit</v-icon>
                                                            <v-icon medium @click="editPreOrder(index, prd, true, prd.days)">delete</v-icon><br><br><hr>
                                                        </div>
                                                    </div>
                                                </div>
                                            </v-card-text>
                                        </v-card>
                                    </v-flex>
                                    <v-dialog v-model="detail" persistent width="500">
                                        <detailPreOrder @closeModal = "closeModal" :sc="info" :customer="customer"></detailPreOrder>
                                    </v-dialog>
                                </v-layout><hr><br><br>
                            </div>
                        </v-container>
                    </div>
                </v-card-text>
                <v-card-actions>
                </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<style>
    @media (max-width: 405px) {
        .dayT{
            font-size:21px;
        }
    }
    @media (max-width: 486px) {
        .dayT{
            font-size:16px;
        }
    }
    @media (max-width: 590px) {
        .dayT{
            font-size:17px;
        }
    }
    .titlee{
        color:black;
        font-size:18px;
    }
    .txt{
        color:black;
    }
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
            preOrdersName:[],
            schedules:[],
            customers:[],
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
            hour:"",
        }
    },
    watch:{
        preOrders(val){
            if(val){
                var names = [];
                for(var s = 0; s < val.length; s++){
                    var next = names.find(element=>{return element.name == val[s]._id.group_name && element.delivery == val[s]._id.delivery_place._id});
                    if(!next){
                        names.push({name:val[s]._id.group_name, delivery:val[s]._id.delivery_place._id});
                    }
                }
                this.preOrdersName = [];
                var preDays;
                for(var s = 0; s < names.length; s++){
                    if(names[s]){
                        preDays = this.formatPreorder(names[s].name, names[s].delivery);
                        this.preOrdersName.push({name:names[s].name, delivery:preDays.delivery, hour:preDays.hour, preOrders:preDays.preOrders});
                    }
                }
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
                //this.product.unit_value = val.price;
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
                if(this.customer_id != ""){
                    this.customer_id = this.customers.find(element=>{return element.value == this.customer_id});
                }
            }
        },
        customer_id(val){
            if(val){
                this.preOrder = {};
                this.getCustomer(this.customer_id.value ? this.customer_id.value : this.customer_id);
                this.fetchPreOrdersCustomer(this.customer_id.value ? this.customer_id.value : this.customer_id);
            }
        },
        customer(val){
            if(val){
                var place = this.formatListD(val.delivery_places, 'place_name', 'cluster_title', 'unit_u', 'id', '_id')[0];
                if(place){
                    this.deliveryPlace = place;
                    this.getHours(place);
                    this.hour = this.schedules[0];
                    this.preOrder.name = place.text;
                    this.preOrder.name += this.hour && this.hour.text ? " - "+this.hour.text : "";
                }
            }
        },
        deliveryPlace(val){
            if(val){
                this.getHours(val);
                this.buildName();
            }
        },  
        hour(val){
            if(val){
                this.buildName();
            }
        },
    },
    mounted () {
        this.fetchRoutes({page_size:-1});
        this.fetchAttributes({page_size:-1});
        this.fetchProducts({page_size:-1});
        this.fetchCustomers({"page_size":-1});
        this.customer_id = this.$route.params.id == undefined ? "" : this.$route.params.id;
    },
    methods: {
        ...mapActions({
            create: 'preOrder/create',
            deletes: 'preOrder/deletes',
            update: 'preOrder/update',
            fetchRoutes: 'route/fetchRoutes',
            fetchAttributes: 'productAttribute/fetchAttributes',
            fetchPreOrdersCustomer: 'preOrder/fetchPreOrdersCustomer',
            fetchProducts: 'product/fetchProducts',
            fetchCustomers: 'customer/fetchCustomers',
            getCustomer: 'customer/getCustomer', 
            setWarning: 'setWarning',
        }),
        buildName(){
            this.preOrder.name = "NF-PR: "+this.deliveryPlace.text;
            this.preOrder.name += this.hour && this.hour.text ? " - "+this.hour.text : "";
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
        formatPreorder(name, delivery){
            var pre = [];
            var obj = {};
            var d = [0,1,2,3,4,5,6];
            var y = [];
            for(var s = 0; s < this.preOrders.length; s++){
                if(this.preOrders[s]._id.group_name == name && this.preOrders[s]._id.delivery_place._id == delivery){
                    pre.push(this.preOrders[s]);
                }
            }
            if(pre[0].pre_orders[0].delivery_place){
                obj.delivery = pre[0].pre_orders[0].delivery_place.place_name+ " " +pre[0].pre_orders[0].delivery_place.cluster_title +" - "+ pre[0].pre_orders[0].delivery_place.unit_u;
            }else{
                obj.delivery = "";
            }
            if(pre[0].pre_orders[0].date){
                obj.hour = pre[0].pre_orders[0].date.split("T")[1].split(".")[0];
            }else{
                obj.hour = "";
            }
            for(var r = 0; r < pre.length; r++){
                y.push(pre[r].pre_orders[0].days);
            }
            for(var r = 0; r < d.length; r++){
                var x = y.find(element=>{return element == d[r]});
                if(x == undefined){
                    pre.push({pre_orders:[{days:d[r]}]});
                }
            }
            if(y.length < 7){
                var newFormat = [];
                var s = 0;
                do{
                    for(var r = 0; r < pre.length; r++){
                        if(pre[r].pre_orders[0].days == s){
                            newFormat.push(pre[r]);
                            s++;
                        }
                    }
                }while(newFormat.length<7)
                pre = newFormat;
            }
            obj.preOrders = pre;
            return obj;
        },
        formatMoney(n, qty) {
            var num
            var p = this.attrs.find(element=>{return element.code == "price" });
            if(p){
                n = n.find(element=>{return element.attribute[0]._id == p._id}).value;
                if(!n)n=0; 
                //this.total += n*qty; 
                num = String(n*qty).replace(/\./g,'');
                if(!isNaN(num)){
                    num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
                    num = num.split('').reverse().join('').replace(/^[\.]/,'');
                }
            }
            return num;
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
            if(opc == "g"){
                subss = this.product.sub_products;
                attrs = this.attributes;
            }else if(opc == "e"){
                subss = this.productsCart[idx].sub_products;
                attrs = this.productsCart[idx].attributes;
            }else if(opc == "p"){
                subss = this.shoppingCart[idx].productsCart[idx2].sub_products;
                attrs = this.shoppingCart[idx].productsCart[idx2].attributes;
            }
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
                    if(opc == "g"){
                        this.product.sub_product = subss[r]._id;
                    }else if(opc == "e"){
                        this.productsCart[idx].sub_product = subss[r]._id;
                    }else if(opc == "p"){
                        this.shoppingCart[idx].productsCart[idx].sub_product = subss[r]._id;
                    }
                    break
                }
            }
            if(opc == "g"){
                this.product.price = price;
            }else if(opc == "e"){
                this.productsCart[idx].price = price;
            }else if(opc == "p"){
                this.shoppingCart[idx].productsCart[idx].price = price * this.shoppingCart[idx].productsCart[idx].quantity;
                this.shoppingCart[idx].productsCart[idx].price_base = price;
            }
            console.log("precio :"+price);
        },
        closeModal(info){
            this.info = "";
            this.detail = false;
            this.fetchPreOrdersCustomer(this.customer_id.value ? this.customer_id.value : this.customer_id);
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
        deletePreOrders(obj){
            var preOrdersDelete = [];
            for(var s = 0; s < obj.preOrders.length; s++){
                for(var r = 0; r < obj.preOrders[s].pre_orders.length; r++){
                    if(obj.preOrders[s].pre_orders[r].hasOwnProperty('item')){
                        var x = preOrdersDelete.find(element=>{return element._id == obj.preOrders[s].pre_orders[r]._id._id});
                        if(x == undefined){
                            preOrdersDelete.push({_id:obj.preOrders[s].pre_orders[r]._id._id});
                        }
                    }
                }
            }
            if(confirm("¿Seguro desea eliminar esta pre compra")){
                this.deletes(preOrdersDelete).then(
                    data => {
                        this.setWarning(data, { root: true }).then(()=>{
                            this.fetchPreOrdersCustomer(this.customer_id.value ? this.customer_id.value : this.customer_id);
                        })
                    },
                    error => {
                });
            }
        },
        deletePreOrder(prd, day){
            var p;
            prd = prd[0].pre_orders[0];
            for(var s = 0; s < prd.days.length; s++){
                if(prd.days[s] == day){
                    p = s;
                    break;
                }
            }
            prd.days.splice(p, 1);
            if(confirm('Seguro dese eliminar el producto del día ? ')){
                this.update([{days:prd.days, _id:prd._id}]).then(
                    data => {
                        this.setWarning(data, { root: true }).then(()=>{
                            this.fetchPreOrdersCustomer(this.customer_id.value ? this.customer_id.value : this.customer_id);
                        })
                    },
                    error => {
                });
            }
        },
        editPreOrder(idx, product, drop = false, day = ""){
            this.shoppingCartEdit = [];
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
            this.formatShopping(drop, day);

        },
        formatShopping(drop, day){
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
                if(this.shoppingCartEdit[r].pre_orders[0].delivery_place){
                    var pl = this.formatListD(this.customer.delivery_places, 'place_name', 'cluster_title', 'unit_u', 'id', '_id').find(element=>{return element.value == this.shoppingCartEdit[r].pre_orders[0].delivery_place._id});
                    this.shoppingCartEdit[r].delivery_place = pl;
                }
                this.shoppingCartEdit[r].product_id = this.shoppingCartEdit[r].pre_orders[0].item.product._id;
                this.shoppingCartEdit[r].sub_product = this.shoppingCartEdit[r].pre_orders[0].item.sub_product;
                this.shoppingCartEdit[r].customer_id = this.customer_id.value ? this.customer_id.value : this.customer_id;
                this.shoppingCartEdit[r]._id = this.shoppingCartEdit[r].pre_orders[0]._id;
                this.shoppingCartEdit.push();
            }
            if(drop){
                this.deletePreOrder(this.shoppingCartEdit, day);
                this.shoppingCartEdit = [];
            }else{
                this.info = {};
                this.info = this.shoppingCartEdit;
                this.shoppingCartEdit = [];
                this.detail = true;
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
            if(day){
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
            }
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
                    this.preOrder.quantity = !this.preOrder.quantity ? 1 : this.preOrder.quantity;
                    this.shoppingCart[s].quantity = Number(this.shoppingCart[s].quantity) + Number(this.preOrder.quantity);
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
                        this.product.customer_id = this.customer_id.value ? this.customer_id.value : this.customer_id;
                        this.product.attributes = [...this.attributes];
                        this.product.days = [];
                        this.product.viewAtt = false;
                        var idxp = "";
                        console.log(this.product);
                        var obj={
                            "delivery_place":this.deliveryPlace, "attributes":this.product.attributes, "categories":this.product.categories, "class":this.product.class, "customer_id":this.product.customer_id,
                            "days":this.product.days, "price":this.product.price, "principal_value":this.product.principal_value, "product_id":this.product.product_id,
                            "quantity":this.preOrder.quantity, "sub_products":this.product.sub_products, "sub_product":this.product.sub_product, "text":this.product.text,
                            "unit_value":this.product.price, "viewAtt":this.product.viewAtt,
                        };
                        if(!inside){
                            idxp = this.productsCart.length == 1 ? 0 : this.productsCart.length - 1;
                            obj.index = idxp < 0 ? 0 : idxp;

                            this.productsCart.push(obj);
                            this.preOrder.finish = true;
                            this.productsCart.push();
                        }else{
                            idxp = this.shoppingCart[idx].productsCart.length == 1 ? 0 : this.shoppingCart[idx].productsCart.length - 1;
                            obj.index = idxp < 0 ? 0 : idxp;

                            var prds = this.shoppingCart[idx].productsCart;
                            obj.price_base = obj.price;
                            obj.price = obj.price * obj.quantity;
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
                        var prdsT = [];
                        for(var s = 0; s < this.productsCart.length; s++){
                            this.productsCart[s].price_base = this.productsCart[s].price;
                            this.productsCart[s].price = this.productsCart[s].price * this.productsCart[s].quantity;
                            prdsT.push(this.productsCart[s]);
                        }
                        var date = new Date();
                        date.setDate(date.getDate() + 1);
                        var dt = date.getFullYear()+"-"+((date.getMonth()+1) < 10 ? "0"+(date.getMonth()+1) : (date.getMonth()+1))+"-"+(date.getDate() < 10 ? "0"+date.getDate(): date.getDate())
                        dt = dt+"T"+this.hour.value+"Z";

                        this.shoppingCart.push({
                            "index":idxp, "name":this.preOrder.name, "date":dt, "delivery_place":this.deliveryPlace, "hour":this.hour,
                            "productsCart":prdsT, "addProduct":false
                        });
                        var idxp = this.shoppingCart.length == 1 ? 0 : this.shoppingCart.length - 1;
                        this.shoppingCart[idxp].index = idxp;
                        this.preOrder.finish = false;
                        this.preOrder.name = "";
                        this.deliveryPlace = "";
                        this.hour = "";
                        this.productsCart = [];
                        break;
                }
            }
        },
        removeArray(opc, arr, idx, idx2 = ""){
            switch(opc){
                case "p":
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
                        "quantity": this.shoppingCart[r].productsCart[g].quantity,
                    };
                    var place = this.shoppingCart[r].productsCart[g].delivery_place && this.shoppingCart[r].productsCart[g].delivery_place.value ? this.shoppingCart[r].productsCart[g].delivery_place.value : this.shoppingCart[r].productsCart[g].delivery_place;
                    json.push({"group_name":this.shoppingCart[r].name, "date":this.shoppingCart[r].date, "days":days, "item":item, "delivery_place":place, "customer":this.shoppingCart[r].productsCart[g].customer_id});
                }
            }
            console.log(json)
            return json;
        },
        processPreOrder () {
            this.create(this.buildPreOrder()).then(
                data => {
                    this.setWarning(data, { root: true }).then(()=>{
                        this.shoppingCart = [];
                        this.fetchPreOrdersCustomer(this.customer_id.value ? this.customer_id.value : this.customer_id);
                    })
                },
                error => {
            });
        },
        redirect(page){
            if(page){
                this.$router.push('/preOrderList')
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
            cutms: state => state.customer.customers,
            preOrders: state => state.preOrder.preOrders,
            attrs: state => state.productAttribute.attributes,
            routes: state => state.route.routes,
        }),
        trySend(){
            if(this.shoppingCart.length > 0){
                return false; 
            }
            return true;
        }
    },
  }
</script>

