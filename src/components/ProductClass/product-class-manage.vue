<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md10>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>{{titleText}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn v-if="edit != 0" color="error" @click="redirect(true)">Cancelar</v-btn>
            <v-btn v-if="edit == 0" color="error" @click="redirect(false)">Cancelar</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form>
                <v-text-field v-model="classs.code" prepend-icon="person" name="title" label="Nombre" type="text"></v-text-field>
                <v-combobox  v-model="classs.parent" :items="classes" prepend-icon="ballot" label="Clase padre"></v-combobox>
                <h2>Atributos estáticos</h2><hr><br>
                <v-alert :value="msgErrorN" type="error">Ya tiene este atributo como atributo personalizable</v-alert> <br>
                <div class="row col-md-8">
                  <v-card style="height: 100%;width: 84%; padding: 31px;">
                    <!--ATRIBUTOS-->
                    <v-data-table v-model="attributes" :headers="headersA" :items="attrN" :pagination.sync="paginationAttr" select-all item-key="_id" class="elevation-1">
                        <template v-slot:headers="props">
                            <tr>
                                <th>
                                    <v-checkbox :input-value="props.all" :indeterminate="props.indeterminate" primary hide-details  @click.stop="removeAttr"></v-checkbox>
                                </th>
                                <th v-for="header in props.headers" :key="header.text" :class="['column sortable', paginationAttr.descending ? 'desc' : 'asc', header.value === paginationAttr.sortBy ? 'active' : '']" @click="changeSortAttr(header.value)">
                                    <v-icon small>arrow_upward</v-icon>
                                    {{ header.text }}
                                </th>
                            </tr>
                        </template>
                        <template v-slot:items="props">
                            <tr :active="props.selected">
                                <td @click="addAtt('a', props.item)">
                                    <v-checkbox :input-value="props.selected" primary hide-details></v-checkbox>
                                </td>
                                <td class="text-xs-right">{{ props.item.code.split('_').join(' ') }}</td>
                                <td class="text-xs-right">{{ props.item.type }}</td>
                                <td class="text-xs-right">{{ props.item.required ? 'Si' : 'No'}}</td>
                                <td class="text-xs-right">
                                    <v-checkbox v-model="props.item.variable" :input-value="props.item.variable" primary hide-details></v-checkbox>
                                </td>
                            </tr>
                        </template>
                    </v-data-table>
                    <!--ATRIBUTOS-->
                  </v-card><br>
                </div><br>
                <h2>Atributos personalizables</h2><hr><br>
                <v-alert :value="msgErrorC" type="error">Ya tiene este atributo como atributo no personalizable</v-alert> <br>
                <div class="row col-md-8">
                  <v-card style="height: 100%;width: 84%; padding: 31px;">
                    <!--ATRIBUTOS PERSONALIZABLES-->
                    <v-data-table v-model="attributesCustomisable" :headers="headersC" :items="attrC" :pagination.sync="paginationAttrCustom" select-all item-key="code" class="elevation-1">
                        <template v-slot:headers="propsC">
                            <tr>
                                <th>
                                    <v-checkbox :input-value="propsC.all" :indeterminate="propsC.indeterminate" primary hide-details  @click.stop="removeAttrCustom"></v-checkbox>
                                </th>
                                <th v-for="header in propsC.headers" :key="header.text" :class="['column sortable', paginationAttrCustom.descending ? 'desc' : 'asc', header.value === paginationAttrCustom.sortBy ? 'active' : '']" @click="changeSortAttrCustom(header.value)">
                                    <v-icon small>arrow_upward</v-icon>
                                    {{ header.text }}
                                </th>
                            </tr>
                        </template>
                        <template v-slot:items="propsC">
                            <tr :active="propsC.selected">
                                <td @click="addAtt('ac', propsC.item)">
                                    <v-checkbox :input-value="propsC.selected" primary hide-details></v-checkbox>
                                </td>
                                <td class="text-xs-right">{{ propsC.item.code.split('_').join(' ') }}</td>
                                <td class="text-xs-right">{{ propsC.item.type }}</td>
                                <td class="text-xs-right">{{ propsC.item.required ? 'Si' : 'No'}}</td>
                                <td>
                                    <v-checkbox v-model="propsC.item.pivot" :input-value="propsC.item.pivot" primary hide-details></v-checkbox>
                                </td>
                                <!--td class="text-xs-right">
                                    <v-checkbox v-model="propsC.item.pp" :input-value="propsC.item.pp" primary hide-details></v-checkbox>
                                </td-->
                            </tr>
                        </template>
                    </v-data-table>
                    <!--ATRIBUTOS PERSONALIZABLES-->
                  </v-card><br>
                </div>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" :disabled="trySend" style="width: 100%;" @click="processClass()">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
var auxArr = ""
  import {mapActions,mapState, mapGetters} from 'vuex';
  
  export default {
    
    name: 'class-manage',
    data () {
      return {
        paginationAttr: {
            sortBy: 'name'
        },
        reserved:[],
        paginationAttrCustom: {
            sortBy: 'name'
        },
        headersA: [
            {text:"Nombre", value:"code"},
            {text:"Tipo", value:"type"},
            {text:"Requerido", value:"required"},
            {text:"Variable", value:"variable"}
        ],
        headersC: [
            {text:"Nombre", value:"code"},
            {text:"Tipo", value:"type"},
            {text:"Requerido", value:"required"},
            {text:"Permite permutación", value:"pivot"}
        ],
        classs: {},
        attributes:[],
        attributesCustomisable:[],
        attributesId:[],
        attributesCustomisableId:[],
        edit:"",
        titleText:"",
        classes:[],
        attrN:[],
        attrC:[],
        msgErrorC :false,
        msgErrorN : false,
        auxA:""
      }
    },
    watch:{
        cl(val){
            if(val){
                this.classs = val;
                this.attributesId = val.attributes;
                this.attributesCustomisableId = val.order_attributes;
            }
        },
        attr(val){
            this.attrN=val;
            this.reserved.push(this.attrN.find(element=>{return element.code == "photo" }));
            this.reserved.push(this.attrN.find(element=>{return element.code == "recipe" }));
            this.reserved.push(this.attrN.find(element=>{return element.code == "price" }));
            for(var s = 0; s < this.attrN.length; s++){
                if(this.attrN[s].code == "price" || this.attrN[s].code == "recipe" || this.attrN[s].code == "photo"){
                    this.attrN.splice(s, 1);
                }
            }
            this.attrC=val;
            for(var s = 0; s < this.attrC.length; s++){
                if(this.attrC[s].code == "price" || this.attrC[s].code == "recipe" || this.attrC[s].code == "photo"){
                    this.attrC.splice(s, 1);
                }
            }
        },
        attributesObj(val){
            this.attributes = val;
        },
        attributesCustomisablesObj(val){
            this.attributesCustomisable = val;
        },
        classess(val){
            for(var s = 0; s < val.length; s++){
                this.classes.push({"text":val[s].code, "value":val[s]._id});
            }
        },
        /*attributes(val){
            if(val)
                this.alternateAttr("c", val);
        },
        attributesCustomisable(val){
            if(val)
                this.alternateAttr("n", val);
        },*/
    },
    mounted () {
        this.fetchAttributes({"page_size":-1});
        this.fetchClasss();
        this.edit = this.$route.params.id == undefined ? 0 : this.$route.params.id;
        if(this.edit!=""){
            this.titleText="Editar clase"
            this.getClass(this.edit);
        }else{
          this.titleText="Nueva clase"
        }
    },
    methods: {
        addAtt(t, val){
            var idx = "";
            if(t == "a"){
                for(var s in this.attributes){
                    if(this.attributes[s]._id == val._id){
                        idx = s;
                        break;
                    }
                }
                if(idx != ""){
                    this.attributes.splice(idx, 1);
                }else{
                    this.attributes.push(val);
                }
                this.attributes.push();
            }else{
                for(var s in this.attributesCustomisable){
                    if(this.attributesCustomisable[s]._id == val._id){
                        idx = s;
                        break;
                    }
                }
                if(idx != ""){
                    this.attributesCustomisable.splice(idx, 1);
                }else{
                    this.attributesCustomisable.push(val);
                }
                this.attributesCustomisable.push();
            }
        },
        ...mapActions({
            create: 'productClass/create',
            update: 'productClass/update',
            getClass: 'productClass/getClass', 
            fetchClasss: 'productClass/fetchClasss',
            fetchAttributes: 'productAttribute/fetchAttributes',
            setWarning: 'setWarning',
        }),
        removeAlternate(arr1, arr2){
            var p = 0;
            var code = "";
            var idx = 0;
            p = this[arr1].length;
            if(p > 0){
                p = p == 0 ? p : p-1;
                code = this[arr1][p]._id;
                console.log(this[arr1][p]);
                for(var s in this[arr2]){
                    if(this[arr2][s]._id === code){
                        idx = s;
                        break;
                    }
                }
                //this[arr2].splice(idx,1);
            }
        },
        alternateAttr(arr, val){
            if(arr=="c"){
                if(this.attributes){
                    for(var s = 0; s < this.attributes.length; s++){
                        for(var r = 0; r < this.attrC.length; r++){
                            if((this.attributes[s] && this.attributes[s]._id) == (this.attrC[r] && this.attrC[r]._id)){
                                this.attrC.splice(r, 1);
                                this.attrN.push(this.attributes[s]);
                            }
                        }
                    }
                }
                this.attrN.push();
                this.attrC.push();
                    //this.validateAlternate("attributes", "attributesCustomisable")
            }else{
                if(this.attributesCustomisable.length > 0){}
                    //this.validateAlternate("attributesCustomisable", "attributes")
            }
        },
        /**Tabla atributos**/ 
        removeAttr() {
            if (this.attributes.length) this.attributes = []
            else this.attributes = this.attributes.slice()
        },
        changeSortAttr (column) {
            if (this.paginationAttr.sortBy === column) {
                this.paginationAttr.descending = !this.paginationAttr.descending
            } else {
                this.paginationAttr.sortBy = column
                this.paginationAttr.descending = false
            }
        },
        /**Tabla atributos personalizables**/ 
        removeAttrCustom() {
            if (this.attributesCustomisable.length) this.attributesCustomisable = []
            else this.attributesCustomisable = this.attributesCustomisable.slice()
        },
        changeSortAttrCustom (column) {
            if (this.paginationAttrCustom.sortBy === column) {
                this.paginationAttrCustom.descending = !this.paginationAttrCustom.descending
            } else {
                this.paginationAttrCustom.sortBy = column
                this.paginationAttrCustom.descending = false
            }
        },
        buildClass(){
            /**Atributos**/
            var attr = [];
            console.log(this.attributes);
            for(var s = 0; s < this.attributes.length; s++){
                if(!attr.find(element=>{return element.id == this.attributes[s]._id })){
                    attr.push({"id":this.attributes[s]._id, "variable":this.attributes[s].variable});
                }
            }
            attr = attr.concat(this.reserved);
            this.classs.attributes = attr;
            /**Atributos personalizables**/
            var attrCustom = [];
            for(var s = 0; s < this.attributesCustomisable.length; s++){
                if(!attrCustom.find(element=>{return element.id == this.attributesCustomisable[s]._id })){
                    attrCustom.push({"id":this.attributesCustomisable[s]._id, "pivot":this.attributesCustomisable[s].pivot});
                }
            }
            this.classs.order_attributes = attrCustom;
            if(this.classs.parent)
                this.classs.parent = this.classs.parent.value;
            return this.classs;
        },
        processClass () {
            this.classs = this.buildClass();
            if(this.edit){
                this.update(this.classs).then(
                    data => {
                        this.setWarning(data, { root: true }).then(()=>{
                            this.$router.push('/classProductDetail/'+this.edit)
                        })
                    },
                    error => {
                })
            }else{
                this.create(this.classs).then(
                    data => {
                        this.setWarning(data, { root: true }).then(()=>{
                            this.$router.push('/classProductList')
                        })
                    },
                    error => {
                })
            }
        },
        redirect(page){
            if(page){
                this.$router.push('/classProductDetail/'+this.edit)
            }else{
                this.$router.push('/classProductList')
            }
        }
    },
    computed:{
        ...mapState({
            warning: state => state.warning,
            cl: state => state.productClass.class, 
            attr: state => state.productAttribute.attributes,
            classess: state => state.productClass.classs, 
        }),
        ...mapGetters({
            getAttributes: 'productAttribute/getAttributes', 
        }),
        trySend(){
            if(this.classs && this.classs.code && this.attributesCustomisable && this.attributes){
                return false; 
            }
            return true;
        },
        attributesObj(){
            var attrs = [];
            if(this.attributesId){
                for(var s in this.attributesId){
                    if(this.attributesId[s]){
                        var at = this.getAttributes(this.attributesId[s].id);
                        if(at){
                            at.variable = this.attributesId[s].variable != undefined ? this.attributesId[s].variable : false;
                        }
                        if(at && at.code != "photo" && at.code != "recipe" && at.code != "price"){
                            attrs.push(at);
                        }
                    }
                }
                return attrs;
            }
        },
        attributesCustomisablesObj(){
            var attrCs = [];
            if(this.attributesCustomisableId){
                for(var s in this.attributesCustomisableId){
                    if(this.attributesCustomisableId[s]){
                        var at = this.getAttributes(this.attributesCustomisableId[s].id);
                        if(at){
                            at.pivot = this.attributesCustomisableId[s].pivot != undefined ? this.attributesCustomisableId[s].pivot : false;
                        }
                        if(at && at.code != "photo" && at.code != "recipe" && at.code != "price"){
                            attrCs.push(at);
                        }
                    }
                }
                return attrCs;
            }
        }
    },
  }
</script>

