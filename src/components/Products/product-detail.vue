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
                <v-dialog v-model="recipe" persistent>
                    <v-card class="elevation-12">
                        <v-toolbar dark color="primary">
                        <v-toolbar-title>Receta</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn color="error" @click="recipe=false">Cerrar</v-btn>
                        </v-toolbar>
                        <v-card-text>
                        <v-form>
                             <v-layout row wra>
                                <v-flex xs12 md12>
                                    <v-layout row wra>
                                        <div v-if="ingredient && subProducts[ingredient.idx] && subProducts[ingredient.idx].ingredients.length > 0">
                                            <v-chip v-for="(i, index) in subProducts[ingredient.idx].ingredients" :key="index">{{i.quantity}} {{i.metric}} de {{i.name}}</v-chip>
                                        </div>
                                        <div v-else>
                                            No registra
                                        </div>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <!--v-btn color="primary" @click="processInput(ingredient.idx)" style="width: 100%;" >Guardar</v-btn-->
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <h2>Sub productos</h2><br>
                <div v-if="subProducts"> 
                    <div row wra>
                        <v-layout align-center row wra >   
                            <v-flex class="alignGrid" v-for="h in subProducts[0]" :key="h.code" xs12 md2>
                                <label class="col-md-2">{{h.code.split("_").join(" ").charAt(0).toUpperCase() + h.code.split("_").join(" ").slice(1)}}</label>
                            </v-flex>
                            <v-flex class="alignGrid" xs12 md2>
                                <label class="col-md-2">Insumos</label>
                            </v-flex>
                            <v-flex class="alignGrid" xs12 md1>
                                <label class="col-md-2">Foto</label>
                            </v-flex>
                            <v-flex class="alignGrid" xs12 md2>
                                <label class="col-md-2">Precio</label>
                            </v-flex>
                        </v-layout><hr><br>
                        <div v-for="(sub, index) in subProducts" :key="index">
                            <v-layout align-center row wra >       
                                <v-flex v-for="(attr, index) in sub" row wra :key="index" xs12 md2>
                                    <div v-if="attr.options && attr.options.length > 0">
                                        <v-flex xs12 md12>
                                            {{attr.value ? attr.value : attr.default_value}}
                                        </v-flex>
                                    </div>
                                    <div v-else>
                                        <div v-if="attr.type == 'boolean'">
                                            <v-flex xs12 md12>
                                                {{attr.value ? attr.value : attr.default_value}}
                                            </v-flex>
                                        </div>
                                        <div v-else>
                                            <div v-if="attr.size == 'short'">
                                                <v-flex xs12 md12>
                                                    {{attr.value ? attr.value : attr.default_value}}
                                                </v-flex>
                                            </div>
                                            <div v-else-if="attr.size == 'medium'">
                                                <v-flex xs12 md12>
                                                    {{attr.value ? attr.value : attr.default_value}}
                                                </v-flex>
                                            </div>
                                            <div v-else>
                                                <v-flex xs12 md12>
                                                    {{attr.value ? attr.value : attr.default_value}}
                                                </v-flex>
                                            </div>
                                        </div>
                                    </div>            
                                </v-flex> 
                                <v-flex class="alignGrid" xs12 md2>
                                    <v-icon  @click="formRecipe(index)">add</v-icon>
                                </v-flex>
                                <v-flex class="alignGrid" xs12 md1>
                                    <!--label class="text-reader">
                                        <v-icon>add</v-icon>
                                        <v-text-field v-model="sub.photo" name="photo" type="file"></v-text-field>
                                    </label-->
                                    <img :src="sub.photo ? sub.photo : 'No hay foto' "/>
                                </v-flex>
                                <v-flex class="alignGrid" xs12 md2>
                                    {{!sub.price ? sub.price = '$ '+product.default_price : '$ '+sub.price}}
                                </v-flex>
                            </v-layout>
                        </div>
                    </div>
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
            recipe:false,
            ingredient:{},
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
                    var att = this.product.product_class.order_attributes;
                    att = att.concat(this.product.product_class.attributes);
                    if(this.inputs){
                        this.formatInputs()
                        this.subProducts = this.detailSubProducts(val.sub_products, att);
                    }
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
            formRecipe(idx){
                this.ingredient.idx = idx;
                this.recipe = true;
            },
            detailSubProducts(subs, attrs){
                console.log(attrs);
                var atts = [];
                for(var s = 0; s < attrs.length; s++){
                    var nat = attrs[s].attribute[0] ? attrs[s].attribute[0] : "";
                    if(nat)
                        atts.push(nat);
                }
                attrs = atts;
                console.log(attrs);
                var lst = [];
                var att = [];
                var photo = "";
                var price = "";
                var recipe = [];
                if(subs){
                    for(var s = 0; s < subs.length; s++){
                        for(var r = 0; r < subs[s].options.length; r++){
                            var at = "";
                            at = Object.assign({...attrs.find(element=>{return element._id == subs[s].options[r].pivot})});
                            if(at){
                                if(at.visible && at.code != "photo"){
                                    at.value = subs[s].options[r].option;
                                    att.push(at)
                                }
                                if(at.code == "photo"){
                                    photo = subs[s].options[r].option;
                                }
                                if(at.code == "price"){
                                    price = subs[s].options[r].option;
                                }
                                if(at.code == "recipe"){
                                    recipe = [];
                                    if(subs[s].options[r].option){
                                        for(var g = 0; g < subs[s].options[r].option.length; g++){
                                            var inp = this.inputs.find(element=>{return element._id == subs[s].options[r].option[g].input});
                                            if(inp){
                                                recipe.push({"name": inp.name, "metric": inp.metric, "id":inp._id, "quantity":subs[s].options[r].option[g].value});
                                            }
                                        }
                                    }
                                }
                            }

                        }
                        att["price"] = price;
                        att["photo"] = photo;
                        att["ingredients"] = recipe;
                        lst.push(att);
                        att = [];
                    }
                }
                return lst;
            },
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

