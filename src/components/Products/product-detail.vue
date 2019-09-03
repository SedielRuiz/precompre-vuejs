<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md10>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Detalle de producto</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="success" @click="redirect(true)">Editar</v-btn>
            <v-btn color="success" @click="redirect(false)">Volver</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form>
                <v-text-field :disabled="true" v-model="product.name" prepend-icon="person" name="name" label="Nombre del producto" type="text"></v-text-field>
                <v-text-field :disabled="true" v-if="product.product_class" v-model="product.product_class.code" prepend-icon="featured_play_list" name="name" label="Clase del producto" type="text"></v-text-field>
                <v-text-field :disabled="true" v-model="product.price" prepend-icon="featured_play_list" name="price" label="Precio" type="number"></v-text-field>
                <v-combobox :disabled="true" v-if="edit!=''" v-model="product.status == 'enable' ? 'Activo' : 'Inactivo'" :items="status" prepend-icon="check_circle_outline" label="Estado"></v-combobox>
                <h2>Atributos</h2><br>
                <div v-if="attributes"> 
                    <v-chip v-for="(attr, index) in attributes" :key="index">{{attr.name.charAt(0).toUpperCase() + attr.name.slice(1)}} - {{attr.value.charAt(0).toUpperCase() + attr.value.slice(1)}}</v-chip>
                </div><hr><br>
                <h2>Atributos personalizados</h2><br>
                <div v-if="order_attributes">
                    <v-chip v-for="(attrc, index) in order_attributes" :key="index">{{attrc.name.charAt(0).toUpperCase() + attrc.name.slice(1)}} - {{attrc.value.charAt(0).toUpperCase() + attrc.value.slice(1)}}</v-chip>
                </div><hr><br>
                <h2>Sub productos</h2><br>
                <div v-if="subProducts"> 
                    <v-layout row wra v-for="sub in subProducts">
                        <v-flex  xs12 md4>
                            <v-layout row wra v-for="p in sub.options">
                                <v-flex xs12 m12>
                                    <label>Variación: {{viewNamePivot(p.pivot)}}</label>
                                </v-flex>
                                <v-flex xs12 md12>
                                    <label>Cantidad: {{p.option}}</label>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex  xs12 md8>
                            <v-layout row wra>
                                <v-flex xs12 md8>
                                    <v-layout align-center row wra>
                                        <v-flex xs12 md4>
                                            <label>Precio: $ {{sub.price}}</label>
                                        </v-flex>
                                        Ingredientes
                                        <v-chip v-for="(i, index) in sub.ingredients" :key="index">{{i.quantity}} {{i.metric}} de {{i.name}}</v-chip>
                                    </v-layout>
                                </v-flex>
                            </v-layout><br>
                        </v-flex>
                        <hr>
                    </v-layout>
                </div><br>
                <h2>Categorias</h2><br>
                <div v-if="categories">
                    <v-chip v-for="(ct, index) in categories" :key="index">{{ct.name}}</v-chip>
                </div><br>
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
    var attrs = [];
    import {mapActions,mapState} from 'vuex';
    
    export default {
        
        name: 'product-manage',
        data () {
        return {
            product: {},
            attributes:[],
            order_attributes:[],
            subProducts:[],
            pivots:[],
            categories:[],
            inputs:[],
            status:[
                {text: 'Activo', value:'enabled'},
                {text: 'Inactivo', value:'disabled'},
            ],
            edit:"",
            class_id:""
        }
        },
        watch:{
            pro(val){
                if(val){
                    this.product = val;
                    this.categories = val.categories;
                    this.formatAttributes("attributes", val.attributes);
                    this.formatAttributes("order_attributes", val.attributes);
                    this.subProducts = val.sub_products;
                    if(this.inputs){this.formatInputs()};
                    this.pivots = val.product_class.order_attributes;
                }
            },
            inp(val){
                if(val){
                    this.inputs = val;
                }
            },
        },
        mounted () {
            this.fetchInputs();
            this.edit = this.$route.params.id == undefined ? 0 : this.$route.params.id;
            if(this.edit!=""){
                this.getProduct(this.edit);
            }
        },
        methods: {
            ...mapActions({
                getProduct: 'product/getProduct', 
                fetchInputs: 'input/fetchInputs', 
                setWarning: 'setWarning',
            }),
            viewNamePivot(id){
                if(id){
                    var p = this.pivots.find(element=>{return element._id == id});
                    return p && p.code ? p.code : "";
                }
            },
            formatInputs(){
                for(var s = 0; s < this.subProducts.length; s++){
                    for(var r = 0; r < this.subProducts[s].ingredients.length; r++){
                        var ing = {};
                        ing = this.inputs.find(element=>{return element._id == this.subProducts[s].ingredients[r].input});
                        ing.quantity = this.subProducts[s].ingredients[r].quantity
                        this.subProducts[s].ingredients[r] = ing;
                    }
                }
            },
            formatAttributes(varArr, arr){
                var attrs = [];
                for(var s = 0; s < arr.length; s++){
                    for(var r = 0; r < this.product.product_class[varArr].length; r++){
                        if(arr[s].code == this.product.product_class[varArr][r]._id){
                            var val = arr[s].value;
                            if(this.product.product_class[varArr][r].type == "boolean")
                                val = val ? 'Si' : 'No';
                            else
                                val = arr[s].value;
                            attrs.push({"name": this.product.product_class[varArr][r].code, "value": val});
                        }
                    }
                }
                this[varArr] = attrs
                return attrs;
            },
            redirect(page){
                if(page){
                    this.$router.push('/productManage/'+this.edit)
                }else{
                    this.$router.push('/productList')
                }
            }
        },
        computed:{
            ...mapState({
                warning: state => state.warning,
                inp: state => state.input.inputs, 
                pro: state => state.product.product,
            }),
        },
    }
</script>

