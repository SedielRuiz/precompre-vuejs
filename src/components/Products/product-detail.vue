<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md10>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-icon large @click="redirect(false)">keyboard_backspace</v-icon>
            <v-toolbar-title>Detalle de producto</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="success" @click="redirect(true)">Editar</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form>
                <v-text-field readonly v-model="product.name" prepend-icon="person" name="name" label="Nombre del producto" type="text"></v-text-field>
                <v-text-field readonly v-if="product.product_class" v-model="product.product_class.code" prepend-icon="featured_play_list" name="name" label="Clase del producto" type="text"></v-text-field>
                <v-text-field readonly v-model="product.price" prepend-icon="featured_play_list" name="price" label="Precio" type="number"></v-text-field>
                <v-combobox readonly v-if="edit!=''" v-model="product.status == 'enable' ? 'Activo' : 'Inactivo'" :items="status" prepend-icon="check_circle_outline" label="Estado"></v-combobox>
                <div v-if="attributes"> 
                    <div v-for="(attr, index) in attributes" :key="index">
                        <div v-if="attr.name == 'photo'" style="text-align:center;">
                            <div v-if="attr.value.length > 1">
                                <v-carousel hide-delimiters>
                                    <v-carousel-item v-for="(pt, i) in attr.value" :key="i" :src="pt.value"></v-carousel-item>
                                </v-carousel>
                            </div>  
                            <div v-else> 
                                <img v-for="pt in attr.value" :src="pt.value ? pt.value : 'No hay foto' "/>
                            </div>
                        </div>  
                        <div v-else> 
                            <div v-if="attr && attr.value">
                                <v-text-field  readonly v-model="attr.value.charAt(0).toUpperCase() + attr.value.slice(1)" prepend-icon="person" name="name" :label="attr.name.charAt(0).toUpperCase() + attr.name.slice(1)" type="text"></v-text-field>
                            </diV>
                        </div>
                    </div>    
                </div><hr><br>
                <!--div v-if="order_attributes">
                    <v-chip v-for="(attrc, index) in order_attributes" :key="index">{{attrc.name.charAt(0).toUpperCase() + attrc.name.slice(1)}} - {{attrc.value.charAt(0).toUpperCase() + attrc.value.slice(1)}}</v-chip>
                </div><hr><br-->
                <h2>Sub productos</h2><br>
                <div v-if="subProducts"> 
                    <div row wrap>
                        <v-layout align-center row wrap >   
                            <v-flex class="alignGrid" v-for="h in subProducts[0]" :key="h.code" xs12 md2>
                                <label class="col-md-2">{{h.code.split("_").join(" ").charAt(0).toUpperCase() + h.code.split("_").join(" ").slice(1)}}</label>
                            </v-flex>
                            <v-flex class="alignGrid" xs12 md1>
                                <label class="col-md-2">Foto</label>
                            </v-flex>
                            <v-flex class="alignGrid" xs12 md2>
                                <label class="col-md-2">Precio</label>
                            </v-flex>
                        </v-layout><hr><br>
                        <div v-for="(sub, index) in subProducts" :key="index">
                            <v-layout align-center row wrap >       
                                <v-flex v-for="(attr, index) in sub" row wrap :key="index" xs12 md2>
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
                                <v-flex class="alignGrid" xs12 md1>
                                    <!--label class="text-reader">
                                        <v-icon>add</v-icon>
                                        <v-text-field v-model="sub.photo" name="photo" type="file"></v-text-field>
                                    </label-->
                                    <v-icon @click="viewPhoto(index)">image</v-icon>
                                    <v-dialog v-model="sub.view_photo" persistent>
                                        <v-card class="elevation-12">
                                            <v-toolbar dark color="primary">
                                            <v-toolbar-title>Foto</v-toolbar-title>
                                                <v-spacer></v-spacer>
                                                <v-btn color="error" @click="closeModal(index)">Cerrar</v-btn>
                                            </v-toolbar>
                                            <v-card-text style="text-align:center;">
                                                <img v-for="ph in sub.photo" :src="ph ? ph : 'No hay foto' " style="width: 30%;height: 45%;"/>
                                            </v-card-text>
                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <!--v-btn color="primary" @click="processInput(ingredient.idx)" style="width: 100%;" >Guardar</v-btn-->
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
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
                    var s = att.find(element=>{return (element.attribute.length > 0 ? element.attribute[0].code : "") == "price" });
                    var atp = val.attributes.find(element=>{return element.code == (s.attribute.length > 0 ? s.attribute[0]._id : "") });
                    if(atp)
                        this.product.price = atp.value;
                    if(this.inputs){
                        this.formatInputs();
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
            closeModal(idx){
                this.subProducts[idx].view_photo = false;
                this.subProducts.push();
            },
            viewPhoto(idx){
                this.subProducts[idx].view_photo = true;
                this.subProducts.push();
            },
            formRecipe(idx){
                this.ingredient.idx = idx;
                this.recipe = true;
            },
            addPhotos(){
                var lst = [];
                var attrs = this.attributes.find(element=>{return element.name == "photo" });
                if(attrs){
                    for(var s = 0; s < attrs.value.length; s++){
                        if(attrs.value[s].extend){
                            lst.push(attrs.value[s].value);
                        }
                    }
                }
                return lst;
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
                var photo = [];
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
                                    for(var g = 0; g < subs[s].options[r].option.length; g++){
                                        photo.push(subs[s].options[r].option[g].text);
                                    }
                                    //Agregar las que heredan del padre
                                    var tt = this.addPhotos();
                                    if(tt.length > 0)
                                        photo = photo.concat(tt);
                                }
                                if(at.code == "price"){
                                    price = subs[s].options[r].option;
                                }
                            }

                        }
                        att["price"] = price;
                        att["photo"] = photo;
                        att["ingredients"] = recipe;
                        lst.push(att);
                        photo = [];
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
                        if(this.product.product_class[varArr][r].attribute.length > 0 && arr[s].code == this.product.product_class[varArr][r].attribute[0]._id && this.product.product_class[varArr][r].attribute[0].visible){
                            if(!this.product.product_class[varArr][r].variable || this.product.product_class[varArr][r].attribute[0].code == "photo"){
                                var val = arr[s].value;
                                if(this.product.product_class[varArr][r].attribute[0].type == "boolean")
                                    val = val ? 'Si' : 'No';
                                else
                                    val = arr[s].value;
                                attrs.push({"name": this.product.product_class[varArr][r].attribute[0].code, "value": val});
                            }
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

