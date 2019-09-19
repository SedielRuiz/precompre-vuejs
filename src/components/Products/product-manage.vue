<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md12>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>{{titleText}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn v-if="edit != ''" color="error" @click="redirect(true)">Cancelar</v-btn>
            <v-btn v-if="edit == 0" color="error" @click="redirect(false)">Cancelar</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form>
                <v-layout row wra>
                    <v-flex xs12 md6>
                        <v-text-field v-model="product.name" prepend-icon="person" name="name" label="Nombre del producto" type="text"></v-text-field>
                    </v-flex>
                    <v-flex xs12 md6>
                        <v-select v-model="product.type" :items="typesProduct" prepend-icon="featured_play_list" label="Tipo de producto"></v-select>
                    </v-flex>
                </v-layout>
                <v-layout row wra>
                    <v-flex xs12 md6>
                        <v-text-field v-model="product.default_price" prepend-icon="featured_play_list" name="price" label="Precio base" type="number"></v-text-field>
                    </v-flex>
                    <v-flex xs12 md6>
                        <v-combobox  v-model="class_id" :items="classes" prepend-icon="featured_play_list" label="Clase de producto"></v-combobox>
                    </v-flex>
                </v-layout>
                <v-combobox v-if="edit!=''" v-model="product.status == 'enable' ? 'Activo' : 'Inactivo'" :items="status" prepend-icon="check_circle_outline" label="Estado"></v-combobox>
                <v-alert :value="msgError" type="info">Por favor llene los atributos requeridos</v-alert> <br>
                <div v-for="(attr, index) in attributes" :key="index+'_'+attr.code" class="row col-md-8">
                    <div v-if="attr.visible && attr.code != 'price'">
                        <!--ATRIBUTOS-->
                        <v-alert :value="attr.msgError ? true : false" type="error">{{attr.msgError}}</v-alert>
                        <div v-if="attr.options.length > 0">
                            <v-combobox  prepend-icon="check_circle_outline" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" :items="attr.options" :label="attr.code"></v-combobox>
                        </div>
                        <div v-else>
                            <div v-if="attr.type == 'boolean'">
                                <v-switch  v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value"></v-switch>
                            </div>
                            <div v-else>
                                <div v-if="attr.size == 'short'">
                                    <v-text-field :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" prepend-icon="library_books" name="title" :label="attr.code" type="text"></v-text-field>
                                </div>
                                <div v-else-if="attr.size == 'medium'">
                                    <v-textarea :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" prepend-icon="library_books" height="77px" solo name="mediumText" :label="attr.code"></v-textarea>
                                </div>
                                <div v-else>
                                    <v-textarea :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" prepend-icon="library_books" height="135px" solo name="mediumText" :label="attr.code"></v-textarea>
                                </div>
                            </div>
                        </div>
                        <!--v-switch v-if="!attr.required" v-model="attr.add" :label="'Agregar'"></v-switch-->
                        <!--ATRIBUTOS--><br>
                    </div>
                </div>
                <div v-if="class_id && (valRecipe())">
                    <h2>Receta</h2><hr><br>
                    <v-layout  row wra>
                        <v-flex xs12 md4>
                            <v-combobox prepend-icon="filter_list" v-model="ingredient.input" :items="inputs" label="Insumos"></v-combobox>
                        </v-flex>
                        <v-flex xs12 md2>
                            <v-text-field v-model="ingredient.quantity" prepend-icon="featured_play_list" name="quantity" label="Cantidad" type="number"></v-text-field>
                        </v-flex>
                        <v-flex xs12 md2>
                            <v-layout row wra>
                                <v-icon medium @click="addArray('i', 'general')">add</v-icon>
                                <v-chip v-for="(i, index) in ingredients" :key="index">{{i.quantity}} {{i.metric}} de {{i.name}} <v-icon medium @click="removeArray('i', index, true)">close</v-icon></v-chip>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </div><br>
                <!--h2 v-if="class_id">Atributos personalizados <hr><br></h2>
                <div v-if="attributes.length > 0">
                  <v-chip v-for="(attr, index) in attributes" :key="index+'_'+attr.code">{{attr.description}} <v-icon medium @click="removeAttribute(index)">close</v-icon></v-chip>
                </div-->
                <!--div v-for="(attrc, index) in attributesCustomisable" :key="index+'_'+attr.code" class="row col-md-8">
                  <v-card  style="height: 100%;width: 84%; padding: 10px;">
                    <v-alert :value="attrc.msgError ? true : false" type="error">{{attrc.msgError}}</v-alert>
                    <v-text-field :disabled="true" v-if="attr.type != 'boolean'" v-model="attrc.code.split('_').join(' ')"  name="title" label="" type="text"></v-text-field>
                    <div v-if="attrc.options.length > 0">
                        <v-combobox  :key="index+'_'+attr.code" v-model="!attrc.value && attrc.value != '' ? attrc.value = attrc.default_value : attrc.value" :value="attrc.default_value" :items="attrc.options" label="Opciones"></v-combobox>
                    </div>
                    <div v-else>
                        <div v-if="attrc.type == 'boolean'">
                            <v-switch  v-model="!attrc.value && attrc.value != '' ? attrc.value = attrc.default_value : attrc.value" :label="attrc.code"></v-switch>
                        </div>
                        <div v-else>
                            <div v-if="attrc.size == 'short'">
                                <v-text-field :key="index+'_'+attr.code" v-model="!attrc.value && attrc.value != '' ? attrc.value = attrc.default_value : attrc.value"  :maxlength="attrc.length_text ? length_text : 99999999 " prepend-icon="library_books" name="title" label="Valor" type="text"></v-text-field>
                            </div>
                            <div v-else-if="attrc.size == 'medium'">
                                <v-textarea :key="index+'_'+attr.code" v-model="!attrc.value && attrc.value != '' ? attrc.value = attrc.default_value : attrc.value"  prepend-icon="library_books" height="77px" solo name="mediumText" label="Escriba un valor y especifique tipos de medias..." :maxlength="attrc.length_text != '' ? length_text : 99999999 "></v-textarea>
                            </div>
                            <div v-else>
                                <v-textarea :key="index+'_'+attr.code" v-model="!attrc.value && attrc.value != '' ? attrc.value = attrc.default_value : attrc.value"  prepend-icon="library_books" height="135px" solo name="mediumText" label="Escriba un valor y especifique tipos de medias..." :maxlength="attrc.length_text != '' ? length_text : 99999999 "></v-textarea>
                            </div>
                        </div>
                    </div>
                  </v-card><br>
                </div-->
                <!--ATRIBUTOS Personalizables-->
                <!--SUB PRODUCTOS-->
                <div v-if="class_id">
                    <v-layout row wra>
                        <v-flex xs12 md12>
                            <h2>Sub productos <v-icon medium @click="addSub ? addSub = false : addSub = true">keyboard_arrow_down</v-icon></h2><br>
                            <div row wra v-if="addSub && subProductsAttribute">
                                <v-layout align-center row wra >   
                                    <v-flex class="alignGrid" v-for="h in subProductsAttribute[0]" :key="h.code" xs12 md1>
                                        <label class="col-md-2">{{h.code.split("_").join(" ").charAt(0).toUpperCase() + h.code.split("_").join(" ").slice(1)}}</label>
                                    </v-flex>
                                    <v-flex class="alignGrid" xs12 md1>
                                        <label class="col-md-2">Insumos</label>
                                    </v-flex>
                                    <v-flex class="alignGrid" xs12 md1>
                                        <label class="col-md-2">Foto</label>
                                    </v-flex>
                                    <v-flex class="alignGrid" xs12 md1>
                                        <label class="col-md-2">Precio</label>
                                    </v-flex>
                                    <v-flex class="alignGrid" xs12 md1>
                                        <label class="col-md-2">Disponible</label>
                                    </v-flex>
                                </v-layout>
                                <div v-for="(sub, index) in subProductsAttribute" :key="index">
                                    <v-layout align-center row wra >       
                                        <v-flex v-for="(attr, index) in sub" row wra :key="index" xs12 md1>
                                            <div v-if="attr.options && attr.options.length > 0">
                                                <v-flex xs12 md12>
                                                    {{attr && attr.value ? attr.value : (attr.default_value ? attr.default_value : "")}}
                                                </v-flex>
                                            </div>
                                            <div v-else>
                                                <div v-if="attr.type == 'boolean'">
                                                    <v-flex xs12 md12>
                                                        <v-switch :disabled="true" :key="index+'_'+attr.code"  v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value"></v-switch>
                                                    </v-flex>
                                                </div>
                                                <div v-else>
                                                    <div v-if="attr.size == 'short'">
                                                        <v-flex xs12 md12>
                                                            <v-text-field :disabled="true" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" prepend-icon="library_books" name="title" :type="attr.type"></v-text-field>
                                                        </v-flex>
                                                    </div>
                                                    <div v-else-if="attr.size == 'medium'">
                                                        <v-flex xs12 md12>
                                                            <v-textarea :disabled="true" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" prepend-icon="library_books" height="77px" name="mediumText"></v-textarea>
                                                        </v-flex>
                                                    </div>
                                                    <div v-else>
                                                        <v-flex xs12 md12>
                                                            <v-textarea :disabled="true" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" prepend-icon="library_books" height="135px" name="mediumText"></v-textarea>
                                                        </v-flex>
                                                    </div>
                                                </div>
                                            </div>            
                                        </v-flex> 
                                        <v-flex class="alignGrid" xs12 md1>
                                            <v-icon  @click="formRecipe(index)">add</v-icon>
                                        </v-flex>
                                        <v-flex class="alignGrid" xs12 md1>
                                            <!--label class="text-reader">
                                                <v-icon>add</v-icon>
                                                <v-text-field v-model="sub.photo" name="photo" type="file"></v-text-field>
                                            </label-->
                                            <v-text-field v-model="!sub.photo ? sub.photo = getPhoto() : sub.photo" name="photo" placeholder="URL" type="text"></v-text-field>
                                        </v-flex>
                                        <v-flex class="alignGrid" xs12 md1>
                                            <v-text-field v-model="!sub.price ? sub.price = product.default_price : sub.price" name="price" placeholder="$ 0.000" type="number"></v-text-field>
                                        </v-flex>
                                        <v-flex class="alignGrid" xs12 md1>
                                            <v-checkbox value input-value="true" v-model="sub.active == null || sub.active == undefined ? sub.active = false : sub.active"></v-checkbox>
                                        </v-flex>
                                    </v-layout>
                                </div>
                            </div>
                        </v-flex>
                    </v-layout><br>
                </div>
                <v-dialog v-model="recipe" persistent>
                    <v-card class="elevation-12">
                        <v-toolbar dark color="primary">
                        <v-toolbar-title>Receta</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn color="success" @click="closeModal()">Ok</v-btn>
                        </v-toolbar>
                        <v-card-text>
                        <v-form>
                             <v-layout row wra>
                                <v-flex xs12 md4>
                                    <v-combobox prepend-icon="filter_list" v-model="ingredient.input" :items="inputs" label="Insumos"></v-combobox>
                                </v-flex>
                                <v-flex xs12 md2>
                                    <v-text-field v-model="ingredient.quantity" prepend-icon="featured_play_list" name="quantity" label="Cantidad" type="number"></v-text-field>
                                </v-flex>
                                <v-flex xs12 md2>
                                    <v-layout row wra>
                                        <v-icon medium @click="addArray('i', ingredient.idx)">add</v-icon>
                                        <div v-if="ingredient && subProductsAttribute[ingredient.idx] && subProductsAttribute[ingredient.idx].ingredients">
                                            <v-chip v-for="(i, index) in subProductsAttribute[ingredient.idx].ingredients" :key="index">{{i.quantity}} {{i.metric}} de {{i.name}} <v-icon medium @click="removeArray('i', index)">close</v-icon></v-chip>
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
                <h2>Categorias</h2><hr><br>
                <div class="row col-md-8">
                    <v-card style="height: 100%;width: 84%; padding: 31px;">
                        <!--CATEGORIAS-->
                        <v-data-table v-model="categories" :headers="headers" :items="rows" :pagination.sync="pagination" select-all item-key="title" class="elevation-1">
                            <template v-slot:headers="props">
                                <tr>
                                    <th>
                                        <v-checkbox :input-value="props.all" :indeterminate="props.indeterminate" primary hide-details  @click.stop="removeCategories"></v-checkbox>
                                    </th>
                                    <th v-for="header in props.headers" :key="header.text" :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']" @click="changeSort(header.value)">
                                        <v-icon small>arrow_upward</v-icon>
                                        {{ header.text }}
                                    </th>
                                </tr>
                            </template>
                            <template v-slot:items="props">
                                <tr :active="props.selected" @click="props.selected = !props.selected">
                                    <td>
                                        <v-checkbox :input-value="props.selected" primary hide-details></v-checkbox>
                                    </td>
                                    <td class="text-xs-right">{{ props.item.title }}</td>
                                    <td class="text-xs-right">{{ props.item.name }}</td>
                                </tr>
                            </template>
                        </v-data-table>
                        <!--CATEGORIAS-->
                    </v-card><br>
                </div>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" :disabled="trySend" style="width: 100%;" @click="processProduct()">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<style>
    .alignGrid{
        /*text-align:center !important;*/
        font-size:20px !important;
    }
    .v-dialog--persistent{
        width:57% !important;
    }

    .text-reader {
        position: relative;
        overflow: hidden;
        display: inline-block;

        /* Fancy button style 😎 */
        border: 1px solid black;
        border-radius: 5px;
        padding: 1px 6px;
        cursor: pointer;
    }
    .text-reader input {
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        opacity: 0;
    }
</style>
<script>
    var attrs = [];
    import Vue from 'vue'
    import {mapActions,mapState} from 'vuex';
    
    export default {
        name: 'product-manage',
        data () {
            return {
                recipe:false,
                ingredient:{},
                ingredients:[],
                inputs:[],
                subProductsAttribute:[],
                sub:"",
                addSub:"",
                pagination: {
                    sortBy: 'name'
                },
                headers: [
                    {text:"Titulo", value:"title"},
                    {text:"Nombre", value:"name"}
                ],
                typesProduct:[  
                    {text:"Simple", value:"simple"},
                    {text:"Complejo", value:"complejo"}
                ],
                product: {},
                classes:[],
                attributes:[],
                attributeCustomisable:{},
                attributesCustomisable:[],
                attributesP:[],
                categories:[],
                status:[
                    {text: 'Activo', value:'enabled'},
                    {text: 'Inactivo', value:'disabled'},
                ],
                edit:"",
                titleText:"",
                class_id:"",
                msgError:false
            }
        },
        watch:{
            pro(val){
                if(val){
                    this.product = val;
                    this.class_id = {"text":val.product_class.code, "value":val.product_class._id};
                    this.attributesP = val.attributes;
                    this.categories = val.categories;
                    if(this.subProductsAttribute.length > 0)this.addSub = true;
                    //this.attributesCustomisable = val.order_attributes;
                }
            },
            classess(val){
                for(var s = 0; s < val.length; s++){
                    this.classes.push({"text":val[s].code, "value":val[s]._id});
                }
            },
            class_id(val){
                if(val){
                    this.getProductClassAttribute(val.value);
                }

            },
            attr(val){
                if(val){
                    this.attributes = val.attributes.attribute;
                    this.formatAttributes("attributes");
                    this.attributesCustomisable = val.order_attributes.attribute;
                    this.formatAttributes("attributesCustomisable");
                    if(this.edit){
                        this.formatAttributeEdit("attributes");
                        this.formatAttributeEdit("attributesCustomisable");
                        var att = this.product.product_class.order_attributes;
                        att = att.concat(this.product.product_class.attributes);
                        this.subProductsAttribute = this.editSubProducts(this.product.sub_products, att);
                        if(this.class_id.value != this.product.product_class._id){
                            this.formatSubProducts(val.order_attributes.attribute);    
                        }
                    }else{
                        this.formatSubProducts(val.order_attributes.attribute);
                    }
                    if(this.subProductsAttribute.length > 0)this.addSub = true;
                }
            },
            inp(val){
                if(val){
                    for(var s = 0; s < val.length; s++){
                        this.inputs.push({"text":val[s].name +" - "+ val[s].metric, "value":val[s]._id});
                    }
                }
            }
        },
        mounted () {
            this.fetchClasss();
            this.fetchCategories();
            this.fetchInputs();
            this.edit = this.$route.params.id == undefined ? 0 : this.$route.params.id;
            if(this.edit!=""){
                this.titleText="Editar producto"
                this.getProduct(this.edit);
            }else{
                this.titleText="Nuevo producto"
            }
        },
        methods: {
            ...mapActions({
                create: 'product/create',
                update: 'product/update',
                getProduct: 'product/getProduct', 
                fetchClasss: 'productClass/fetchClasss', 
                fetchCategories: 'category/fetchCategories', 
                fetchInputs: 'input/fetchInputs', 
                getProductClassAttribute: 'product/getProductClassAttribute', 
                setWarning: 'setWarning',
            }),
            valRecipe(){
                return this.attributes.find(element=>{return element.code == "recipe"}) ? true : false;
            },
            getPhoto(){
                var at = this.attributes.find(element=>{return element.code == "photo"});
                return at && at.default_value ? at.default_value : at.value;
            },
            closeModal(){
                this.recipe = false;
            },
            formRecipe(idx){
                this.ingredient.idx = idx;
                this.recipe = true;
            },
            complement(array){
                console.log(array);
                let permutations = []; 
                for(let i = 0; i < array.length; i++){
                    if(array[i].visible){
                        let i_permutations = [...permutations];
                        for(let j = 0; j < array[i].options.length; j++){
                            if(i==0){
                                array[i].active = true;
                                const option = array[i]
                                permutations.push([{...option, default_value:option.options[j].value}]);
                            }else{
                                if(j>0) permutations = [...permutations.concat([...i_permutations])]
                            }
                        }
                        for(let j = 0; j < array[i].options.length; j++){
                            for(let k = i_permutations.length*j; k < i_permutations.length*(j+1); k++){
                                let x = [...permutations[k]] 
                                array[i].active = true;
                                const option = array[i]
                                x.push({...option, default_value:option.options[j].value});
                                permutations[k] = [...x]
                            }
                        }
                    }
                }
                console.log(permutations);
                return permutations;
            },
            formatList(list, name, code){
                var lst = [];
                if(list){
                    for(var s = 0; s < list.length; s++){
                        lst.push({"text":list[s][name], "value":list[s][code]});
                    }
                }
                return lst;
            },
            formatSubProducts(attributes){
                this.subProductsAttribute = this.complement(attributes);
                for(var s = 0; s < this.subProductsAttribute.length; s++){
                    this.subProductsAttribute[s].ingredients = this.ingredients ? this.ingredients : [];
                }
            },
            editSubProducts(subs, attrs){
                console.log(attrs);
                var atts = [];
                for(var s = 0; s < attrs.length; s++){
                    var nat = attrs[s].attribute[0] ? attrs[s].attribute[0] : "";
                    if(nat)
                        atts.push(nat);
                }
                attrs = atts;
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
                                            var inp = this.inputs.find(element=>{return element.value == subs[s].options[r].option[g].input});
                                            if(inp)
                                                recipe.push({"name": inp.text.split("-")[0], "metric": inp.text.split("-")[1], "id":inp.value, "quantity":subs[s].options[r].option[g].value});
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
                console.log(lst);
                return lst;
            },
            addArray(arr, idx){
                switch(arr) {
                    case "i":
                        var ing = [];
                        var ingr = Object.assign({...this.ingredient});
                        var obj = {
                            "id": ingr.input.value,
                            "quantity":ingr.quantity,
                            "name": ingr.input.text.split("-")[0], 
                            "metric": ingr.input.text.split("-")[1],
                        }
                        if(idx == "general"){
                            this.ingredients.push(Object.assign({...obj}));
                        }else{
                            ing = Array.isArray(this.subProductsAttribute[idx].ingredients) ? this.subProductsAttribute[idx].ingredients : [];
                            ing.push(Object.assign({...obj}));
                            this.subProductsAttribute[idx].ingredients = ing;
                        }
                        this.ingredients.push();
                        this.subProductsAttribute.push();
                        this.ingredient.input = "";
                        this.ingredient.quantity = "";
                        break;
                }
            },
            removeArray(arr, idx, gn = false){
                switch(arr) {
                    case "i":
                        if(gn){
                            this.ingredients.splice(idx, 1);
                        }else{
                            var ing = Array.isArray(this.subProductsAttribute[idx].ingredients) ? this.subProductsAttribute[idx].ingredients : [];
                            ing.splice(idx,1);
                            this.ingredient.input = "";
                            this.ingredient.quantity = "";
                            this.subProductsAttribute[idx].ingredients = ing;
                            this.subProductsAttribute.push();
                        }
                        break;
                }
            },
            removeCategories () {
                if (this.categories.length) this.categories = []
                else this.categories = this.rows.slice()
            },
            changeSort (column) {
                if (this.pagination.sortBy === column) {
                    this.pagination.descending = !this.pagination.descending
                } else {
                    this.pagination.sortBy = column
                    this.pagination.descending = false
                }
            },
            formatAttributeEdit(arr1){
                for(var s = 0; s < this[arr1].length; s++){
                    for(var r = 0; r < this.attributesP.length; r++){
                        if(this[arr1][s]._id == this.attributesP[r].code){
                            this[arr1][s].value = this.attributesP[r].value;

                            if(this[arr1][s].code == "recipe"){
                                for(var g = 0; g < this.attributesP[r].value.option.length; g++){
                                    var inp = this.inputs.find(element=>{return element.value == this.attributesP[r].value.option[g].input});
                                    if(inp)
                                        this.ingredients.push({"name": inp.text.split("-")[0], "metric": inp.text.split("-")[1], "id":inp.value, "quantity":this.attributesP[r].value.option[g].value});
                                }
                            }

                            if(this[arr1][s].code == "price"){
                                this.product.default_price = this.attributesP[r].value;
                            }

                        }
                    }
                }
            },
            formatAttributes(arr){
                for(var s = 0; s < this[arr].length; s++){
                    var opc = []
                    for(var r = 0; r < this[arr][s].options.length; r++){
                        opc.push({"text":this[arr][s].options[r].code.charAt(0).toUpperCase() + this[arr][s].options[r].code.slice(1), "value":this[arr][s].options[r].code});
                    }
                    this[arr][s].options = opc
                }
            },
            valAttrRequired(attr){
                var next = false;
                var val = attr.options.length > 0 && attr.value.value ? attr.value.value : attr.value;
                if(val != "" && val != undefined && val.trim() != "")
                    next = true;
                return next;
            },
            valAttrNoRequired(val){
                var next = true;
                if(val == "" || val == undefined || val.trim() == "")
                    next = false;
                return next;
            },
            buildAttr(attr){
                var obj = {};
                this.msgError = false;
                for(var s = 0; s < this[attr].length; s++){
                    var val  = this[attr][s].options.length > 0 && this[attr][s].value.value ? this[attr][s].value.value : this[attr][s].value;
                    if( (this[attr][s].code == "recipe" || this[attr][s].required && this.valAttrRequired(this[attr][s])) || (!this[attr][s].required && this.valAttrNoRequired(val)) || !this[attr][s].visible ){
                        val = this[attr][s].code == "price" ? this.product.default_price : val;
                        val = this[attr][s].code == "recipe" ? this.formatIngredients(this.ingredients) : val;
                        this[attr][s].msgError = "";
                        obj = {};
                        obj.code = this[attr][s]._id;
                        obj.value = val;
                        obj.customizable = attr == 'attributes' ? false : true;
                        attrs.push(obj);
                    }else{
                        if(this[attr][s].required){
                            this.msgError = true;
                            this[attr][s].msgError = "Este atributo es obligatorio";
                            break;
                        }
                    }
                }
            },
            buildAttributes(){
                attrs = [];
                //Armo atributos no personalizables
                this.buildAttr("attributes");
                //Armo atributos personalizables
                //if(!this.msgError)
                    //this.buildAttr("attributesCustomisable");
            },
            formatCategories(){
                var ct = [];
                for(var s = 0; s < this.categories.length; s++){
                    ct.push(this.categories[s]._id);
                }
                return ct;
            },
            formatIngredients(arr){
                var lst = [];
                var obj = {};
                for(var s = 0; s < arr.length; s++){
                    lst.push({"input":arr[s].id, "value":arr[s].quantity});
                }
                obj.pivot = this.attributes.find(element=>{return element.code == "recipe"})._id;
                obj.option = lst
                return obj;
            },
            buildSubProducts(){
                console.log(this.subProductsAttribute);
                var subP = [];
                var lst = [];
                for(var s = 0; s < this.subProductsAttribute.length; s++){
                    lst = []
                    for(var r = 0; r < this.subProductsAttribute[s].length; r++){
                        if(this.subProductsAttribute[s][r] && this.subProductsAttribute[s]["active"] == true){
                            lst.push({"pivot":this.subProductsAttribute[s][r]._id, "option":this.subProductsAttribute[s][r].value ? this.subProductsAttribute[s][r].value : this.subProductsAttribute[s][r].default_value });
                        }
                    }
                    if(this.subProductsAttribute[s]["ingredients"]){
                        lst.push(this.formatIngredients(this.subProductsAttribute[s]["ingredients"]));
                    }
                    
                    var pht = this.attributes.find(element=>{return element.code == "photo"});
                    lst.push({"pivot":pht._id, "option":this.subProductsAttribute[s]["photo"] ? this.subProductsAttribute[s]["photo"] : (pht && pht.value ? pht.value : pht.default_value)});

                    var prc = this.attributes.find(element=>{return element.code == "price"});
                    lst.push({ "pivot":prc._id, "option":this.subProductsAttribute[s]["price"] ? this.subProductsAttribute[s]["price"] : product.default_price });

                    subP.push({
                        "status": this.subProductsAttribute[s]["active"],
                        "options":lst,
                    });
                }
                return subP;
            },
            buildProduct(){
                this.product.sub_products = this.buildSubProducts();
                this.buildAttributes();
                this.product.product_class = this.class_id.value;
                this.product.attributes = attrs;
                this.product.categories = this.formatCategories();
                if(this.edit)
                    this.product.status = this.product.status.value;
                return this.product;
            },
            processProduct () {
                this.product = this.buildProduct();
                console.log(this.product);
                if(this.edit){
                    this.update(this.product).then(
                        data => {
                            this.setWarning(data.message, { root: true }).then(()=>{
                                this.$router.push('/productDetail/'+this.edit)
                            })
                        },
                        error => {
                    })
                }else{
                    if(!this.msgError){
                        this.create(this.product).then(
                            data => {
                                this.setWarning(data.message, { root: true }).then(()=>{
                                    this.$router.push('/productList')
                                })
                            },
                            error => {
                        })
                    }
                }
            },
            redirect(page){
                if(page){
                    this.$router.push('/productDetail/'+this.edit)
                }else{
                    this.$router.push('/productList')
                }
            }
        },
        computed:{
            ...mapState({
                warning: state => state.warning,
                pro: state => state.product.product, 
                classess: state => state.productClass.classs,
                attr: state => state.product.attrClass, 
                inp: state => state.input.inputs, 
                rows: state => state.category.categories, 
            }),
            trySend(){
                if(this.edit || this.product && this.product.name && this.product.type && this.product.default_price && this.class_id){
                    return false; 
                }
                return true;
            }
        },
    }
</script>

