<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md10>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>{{titleText}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn v-if="edit != ''" color="success" @click="redirect(true)">Cancelar</v-btn>
            <v-btn v-if="edit == 0" color="success" @click="redirect(false)">Cancelar</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form>
                <v-text-field v-model="product.name" prepend-icon="email" name="name" label="Nombre del producto" type="text"></v-text-field>
                <v-combobox  v-model="class_id" :items="classes" prepend-icon="email" label="Clase de producto"></v-combobox>
                <v-combobox v-if="edit!=''" v-model="product.status == 'enable' ? 'Activo' : 'Inactivo'" :items="status" prepend-icon="email" label="Estado"></v-combobox>
                <h2>Atributos</h2><br>
                <div v-for="(attr, index) in attributes" :key="index" class="row col-md-8">
                  <v-card  style="height: 100%;width: 84%; padding: 31px;">
                    <!--ATRIBUTOS-->
                    <v-text-field v-if="attr.type != 'boolean'" :disabled="true" v-model="attr.code" prepend-icon="title" name="title" label="" type="text"></v-text-field>
                    <div v-if="attr.options.length > 0">
                        <v-combobox  :key="index" v-model="attr.value" :items="attr.options" prepend-icon="email" label="Opciones"></v-combobox>
                    </div>
                    <div v-else>
                        <div v-if="attr.type == 'boolean'">
                            <v-switch v-model="attr.value" :value="attr.default_value" :label="attr.code"></v-switch>
                        </div>
                        <div v-else>
                            <div v-if="attr.size == 'short'">
                                <v-text-field :key="index" v-model="attr.value" prepend-icon="title" name="title" label="Valor" type="text"></v-text-field>
                            </div>
                            <div v-else-if="attr.size == 'medium'">
                                <v-textarea :key="index" v-model="attr.value" prepend-icon="title" height="77px" solo name="mediumText" label="Escriba un valor" :value="attr.default_value"></v-textarea>
                            </div>
                            <div v-else>
                                <v-textarea :key="index" v-model="attr.value" prepend-icon="title" height="135px" solo name="mediumText" label="Escriba un valor" :value="attr.default_value"></v-textarea>
                            </div>
                        </div>
                    </div>
                    <v-switch v-if="!attr.required" v-model="attr.add" :label="'Agregar'"></v-switch>
                    <!--ATRIBUTOS-->
                  </v-card><br>
                </div><br>
                <h2>Atributos personalizados</h2><br>
                <!--div v-if="attributes.length > 0">
                  <v-chip v-for="(attr, index) in attributes" :key="index">{{attr.description}} <v-icon medium @click="removeAttribute(index)">close</v-icon></v-chip>
                </div-->
                <div v-for="(attrc, index) in attributesCustomisable" :key="index" class="row col-md-8">
                  <v-card  style="height: 100%;width: 84%; padding: 31px;">
                    <!--ATRIBUTOS Personalizables-->
                    <v-text-field :disabled="true" v-if="attr.type != 'boolean'" v-model="attrc.code" prepend-icon="title" name="title" label="" type="text"></v-text-field>
                    <div v-if="attrc.options.length > 0">
                        <v-combobox  :key="index" v-model="attrc.value" :items="attrc.options" prepend-icon="email" label="Opciones"></v-combobox>
                    </div>
                    <div v-else>
                        <div v-if="attrc.type == 'boolean'">
                            <v-switch v-model="attrc.value" :value="attr.default_value" :label="attrc.code"></v-switch>
                        </div>
                        <div v-else>
                            <div v-if="attrc.size == 'short'">
                                <v-text-field :key="index" v-model="attrc.value" :maxlength="attrc.length_text ? length_text : 99999999 " prepend-icon="title" name="title" label="Valor" type="text"></v-text-field>
                            </div>
                            <div v-else-if="attrc.size == 'medium'">
                                <v-textarea :key="index" v-model="attrc.value" prepend-icon="title" height="77px" solo name="mediumText" label="Escriba un valor" :value="attrc.default_value" :maxlength="attrc.length_text != '' ? length_text : 99999999 "></v-textarea>
                            </div>
                            <div v-else>
                                <v-textarea :key="index" v-model="attrc.value" prepend-icon="title" height="135px" solo name="mediumText" label="Escriba un valor" :value="attrc.default_value" :maxlength="attrc.length_text != '' ? length_text : 99999999 "></v-textarea>
                            </div>
                        </div>
                    </div>
                    <v-switch v-if="!attrc.required" v-model="attrc.add" :label="'Agregar'"></v-switch>
                    <!--ATRIBUTOS Personalizables-->
                  </v-card><br>
                </div>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="processProduct()">Guardar</v-btn>
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
            classes:[],
            attributes:[],
            attributeCustomisable:{},
            attributesCustomisable:[],
            status:[
                {text: 'Activo', value:'enabled'},
                {text: 'Inactivo', value:'disabled'},
            ],
            edit:"",
            titleText:"",
            class_id:""
        }
        },
        watch:{
            pro(val){
            if(val){
                this.product = val;
                this.attributes = val.attributes;
                this.attributesCustomisable = val.order_attributes;
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
                this.attributes = val.attributes;
                this.formatAttributes("attributes");
                this.attributesCustomisable = val.order_attributes;
                this.formatAttributes("attributesCustomisable");
                console.log(this.attributes);
            }
        },
        mounted () {
            this.fetchClasss();
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
                getProductClassAttribute: 'product/getProductClassAttribute', 
                setWarning: 'setWarning',
            }),
            formatAttributes(arr){
                for(var s = 0; s < this[arr].length; s++){
                    var opc = []
                    for(var r = 0; r < this[arr][s].options.length; r++){
                        opc.push({"text":this[arr][s].options[r].code.charAt(0).toUpperCase() + this[arr][s].options[r].code.slice(1), "value":this[arr][s].options[r].code});
                    }
                    this[arr][s].options = opc
                }
            },
            buildAttr(attr){
                var obj = {};
                console.log(this[attr]);
                for(var s = 0; s < this[attr].length; s++){
                    if(this[attr][s].required || (!this[attr][s].required && this[attr][s].add)){
                        obj = {};
                        obj.code = this[attr][s]._id;
                        obj.value =  this[attr][s].options.length > 0 ? this[attr][s].value.value : this[attr][s].value;
                        obj.customizable = attr == 'attributes' ? false : true;
                        attrs.push(obj);
                    }
                }
            },
            buildAttributes(){
                attrs = [];
                //Armo atributos no personalizables
                this.buildAttr("attributes");
                //Armo atributos personalizables
                this.buildAttr("attributesCustomisable");
                console.log(attrs);
            },
            buildProduct(){
                this.buildAttributes();
                this.product.product_class = this.class_id.value;
                this.product.attributes = attrs;
                if(this.edit)
                    this.product.status = this.product.status.value;
                console.log(this.product)
                return this.product;
            },
            processProduct () {
                this.product = this.buildProduct();
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
                    this.create(this.product).then(
                        data => {
                            this.setWarning(data.message, { root: true }).then(()=>{
                                this.$router.push('/productList')
                            })
                        },
                        error => {
                    })
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
            }),
        },
    }
</script>

