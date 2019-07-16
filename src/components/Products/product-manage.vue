<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md10>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>{{titleText}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn v-if="edit != ''" color="error" @click="redirect(true)">Cancelar</v-btn>
            <v-btn v-if="edit == 0" color="error" @click="redirect(false)">Cancelar</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form>
                <v-text-field v-model="product.name" prepend-icon="email" name="name" label="Nombre del producto" type="text"></v-text-field>
                <v-combobox  v-model="class_id" :items="classes" prepend-icon="email" label="Clase de producto"></v-combobox>
                <v-combobox v-if="edit!=''" v-model="product.status == 'enable' ? 'Activo' : 'Inactivo'" :items="status" prepend-icon="email" label="Estado"></v-combobox>
                <h2>Atributos</h2><hr><br>
                <v-alert :value="msgError" type="info">Por favor llene los atributos requeridos</v-alert> <br>
                <div v-for="(attr, index) in attributes" :key="index+'_'+attr.code" class="row col-md-8">
                  <v-card  style="height: 100%;width: 84%; padding: 10px;">
                    <!--ATRIBUTOS-->
                    <v-alert :value="attr.msgError ? true : false" type="error">{{attr.msgError}}</v-alert>
                    <v-text-field v-if="attr.type != 'boolean'" :disabled="true" v-model="attr.code.split('_').join(' ')" prepend-icon="title" name="title" label="" type="text"></v-text-field>
                    <div v-if="attr.options.length > 0">
                        <v-combobox  :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" :items="attr.options" prepend-icon="email" label="Opciones"></v-combobox>
                    </div>
                    <div v-else>
                        <div v-if="attr.type == 'boolean'">
                            <v-switch prepend-icon="title" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" :label="attr.code"></v-switch>
                        </div>
                        <div v-else>
                            <div v-if="attr.size == 'short'">
                                <v-text-field :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" prepend-icon="title" name="title" label="Valor" type="text"></v-text-field>
                            </div>
                            <div v-else-if="attr.size == 'medium'">
                                <v-textarea :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" prepend-icon="title" height="77px" solo name="mediumText" label="Escriba un valor y especifique tipos de medias..."></v-textarea>
                            </div>
                            <div v-else>
                                <v-textarea :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" prepend-icon="title" height="135px" solo name="mediumText" label="Escriba un valor y especifique tipos de medias..."></v-textarea>
                            </div>
                        </div>
                    </div>
                    <!--v-switch v-if="!attr.required" v-model="attr.add" :label="'Agregar'"></v-switch-->
                    <!--ATRIBUTOS-->
                  </v-card><br>
                </div><br>
                <h2>Atributos personalizados</h2><hr><br>
                <!--div v-if="attributes.length > 0">
                  <v-chip v-for="(attr, index) in attributes" :key="index+'_'+attr.code">{{attr.description}} <v-icon medium @click="removeAttribute(index)">close</v-icon></v-chip>
                </div-->
                <div v-for="(attrc, index) in attributesCustomisable" :key="index+'_'+attr.code" class="row col-md-8">
                  <v-card  style="height: 100%;width: 84%; padding: 10px;">
                    <!--ATRIBUTOS Personalizables-->
                    <v-alert :value="attrc.msgError ? true : false" type="error">{{attrc.msgError}}</v-alert>
                    <v-text-field :disabled="true" v-if="attr.type != 'boolean'" v-model="attrc.code.split('_').join(' ')" prepend-icon="title" name="title" label="" type="text"></v-text-field>
                    <div v-if="attrc.options.length > 0">
                        <v-combobox  :key="index+'_'+attr.code" v-model="!attrc.value && attrc.value != '' ? attrc.value = attrc.default_value : attrc.value" :value="attrc.default_value" :items="attrc.options" prepend-icon="email" label="Opciones"></v-combobox>
                    </div>
                    <div v-else>
                        <div v-if="attrc.type == 'boolean'">
                            <v-switch prepend-icon="title" v-model="!attrc.value && attrc.value != '' ? attrc.value = attrc.default_value : attrc.value" :label="attrc.code"></v-switch>
                        </div>
                        <div v-else>
                            <div v-if="attrc.size == 'short'">
                                <v-text-field :key="index+'_'+attr.code" v-model="!attrc.value && attrc.value != '' ? attrc.value = attrc.default_value : attrc.value"  :maxlength="attrc.length_text ? length_text : 99999999 " prepend-icon="title" name="title" label="Valor" type="text"></v-text-field>
                            </div>
                            <div v-else-if="attrc.size == 'medium'">
                                <v-textarea :key="index+'_'+attr.code" v-model="!attrc.value && attrc.value != '' ? attrc.value = attrc.default_value : attrc.value"  prepend-icon="title" height="77px" solo name="mediumText" label="Escriba un valor y especifique tipos de medias..." :maxlength="attrc.length_text != '' ? length_text : 99999999 "></v-textarea>
                            </div>
                            <div v-else>
                                <v-textarea :key="index+'_'+attr.code" v-model="!attrc.value && attrc.value != '' ? attrc.value = attrc.default_value : attrc.value"  prepend-icon="title" height="135px" solo name="mediumText" label="Escriba un valor y especifique tipos de medias..." :maxlength="attrc.length_text != '' ? length_text : 99999999 "></v-textarea>
                            </div>
                        </div>
                    </div>
                    <!--v-switch v-if="!attrc.required" v-model="attrc.add" :label="'Agregar'"></v-switch-->
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
            attributesP:[],
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
                this.attributes = val.attributes;
                this.formatAttributes("attributes");
                this.attributesCustomisable = val.order_attributes;
                this.formatAttributes("attributesCustomisable");
                if(this.edit){
                    this.formatAttributeEdit("attributes");
                    this.formatAttributeEdit("attributesCustomisable");
                }   
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
            formatAttributeEdit(arr1){
                for(var s = 0; s < this[arr1].length; s++){
                    for(var r = 0; r < this.attributesP.length; r++){
                        if(this[arr1][s]._id == this.attributesP[r].code){
                            this[arr1][s].value = this.attributesP[r].value;
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
                    if((this[attr][s].required && this.valAttrRequired(this[attr][s])) || (!this[attr][s].required && this.valAttrNoRequired(val))){
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
                if(!this.msgError)
                    this.buildAttr("attributesCustomisable");
            },
            buildProduct(){
                this.buildAttributes();
                this.product.product_class = this.class_id.value;
                this.product.attributes = attrs;
                if(this.edit)
                    this.product.status = this.product.status.value;
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
            }),
        },
    }
</script>

