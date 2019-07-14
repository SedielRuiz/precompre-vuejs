<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md10>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>{{titleText}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn v-if="edit != 0" color="success" @click="redirect(true)">Cancelar</v-btn>
            <v-btn v-if="edit == 0" color="success" @click="redirect(false)">Cancelar</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form>
                <v-text-field v-model="classs.code" prepend-icon="email" name="title" label="Nombre" type="text"></v-text-field>
                <h2>Atributos</h2><br>
                <div class="row col-md-8">
                  <v-card style="height: 100%;width: 84%; padding: 31px;">
                    <!--ATRIBUTOS-->
                    <v-data-table v-model="attributes" :headers="headers" :items="attrN" :pagination.sync="paginationAttr" select-all item-key="code" class="elevation-1">
                        <template v-slot:headers="props">
                            <tr>
                                <th>
                                    <v-checkbox :input-value="props.all" :indeterminate="props.indeterminate" primary hide-details  @click.stop="removeAttr"></v-checkbox>
                                </th>
                                <th v-for="header in props.headers" :key="header.text" :class="['column sortable', paginationAttr.descending ? 'desc' : 'asc', header.value === paginationAttr.sortBy ? 'active' : '']" @click="changeSort(header.value)">
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
                                <td class="text-xs-right">{{ props.item.code }}</td>
                                <td class="text-xs-right">{{ props.item.type }}</td>
                                <td class="text-xs-right">{{ props.item.required }}</td>
                            </tr>
                        </template>
                    </v-data-table>
                    <!--ATRIBUTOS-->
                  </v-card><br>
                </div><br>
                <h2>Atributos personalizables</h2><br>
                <div class="row col-md-8">
                  <v-card style="height: 100%;width: 84%; padding: 31px;">
                    <!--ATRIBUTOS PERSONALIZABLES-->
                    <v-data-table v-model="attributesCustomisable" :headers="headers" :items="attrC" :pagination.sync="paginationAttrCustom" select-all item-key="code" class="elevation-1">
                        <template v-slot:headers="props">
                            <tr>
                                <th>
                                    <v-checkbox :input-value="props.all" :indeterminate="props.indeterminate" primary hide-details  @click.stop="removeAttrCustom"></v-checkbox>
                                </th>
                                <th v-for="header in props.headers" :key="header.text" :class="['column sortable', paginationAttrCustom.descending ? 'desc' : 'asc', header.value === paginationAttrCustom.sortBy ? 'active' : '']" @click="changeSort(header.value)">
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
                                <td class="text-xs-right">{{ props.item.code }}</td>
                                <td class="text-xs-right">{{ props.item.type }}</td>
                                <td class="text-xs-right">{{ props.item.required }}</td>
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
            <v-btn color="primary" @click="processClass()">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import {mapActions,mapState} from 'vuex';
  
  export default {
    
    name: 'class-manage',
    data () {
      return {
        paginationAttr: {
            sortBy: 'name'
        },
        paginationAttrCustom: {
            sortBy: 'name'
        },
        headers: [
            {text:"Nombre", value:"code"},
            {text:"Tipo", value:"type"},
            {text:"Requerido", value:"required"}
        ],
        classs: {},
        attributes:[],
        attributesCustomisable:[],
        edit:"",
        titleText:"",
        attrN:[],
        attrC:[]
      }
    },
    watch:{
        cl(val){
            if(val){
                this.classs = val;
                this.attributes = val.attributes;
                this.attributesCustomisable = val.attributesCustomisable;
            }
        },
        attr(val){
            this.attrN = val;
            this.attrC = val;
        },
        attributes(val){
            if(val.length > 0)
                this.alternateAttr("c");
        },
        attributesCustomisable(val){
            if(val.length > 0)
                this.alternateAttr("n");
        },
    },
    mounted () {
        this.fetchAttributes();
        this.edit = this.$route.params.id == undefined ? 0 : this.$route.params.id;
        if(this.edit!=""){
            this.titleText="Editar clase"
            this.getClass(this.edit);
        }else{
          this.titleText="Nueva clase"
        }
    },
    methods: {
        ...mapActions({
            create: 'productClass/create',
            update: 'productClass/update',
            getClass: 'productClass/getClass', 
            fetchAttributes: 'productAttribute/fetchAttributes',
            setWarning: 'setWarning',
        }),
        removeAlternate(arr1, arr2){
            console.log(this.attrC)
            var p = 0;
            var code = "";
            var idx = 0;
            p = this[arr1].length;
            if(p > 0){
                p = p == 0 ? p : p-1;
                code = this[arr1][p].code;
                for(var s in this[arr2]){
                    if(this[arr2] == code){
                        idx = s;
                        break;
                    }
                }
                console.log("vuelo code:" + code +"y posicion :"+idx);
                this[arr2].splice(idx,1);
            }
        },
        alternateAttr(arr){
            if(arr=="c"){
                if(this.attributes.length > 0)
                    this.removeAlternate("attributes", "attrC")
            }else{
                if(this.attributesCustomisable.length > 0)
                    this.removeAlternate("attributesCustomisable", "attrN")
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
            for(var s = 0; s < this.attributes.length; s++){
                attr.push(this.attributes[s].code);
            }
            this.classs.attributes = attr;
            /**Atributos personalizables**/
            var attrCustom = [];
            for(var s = 0; s < this.attributesCustomisable.length; s++){
                attrCustom.push(this.attributesCustomisable[s].code);
            }
            this.classs.attributesCustomisable = attrCustom;
            return this.classs;
        },
        processClass () {
            this.classs = this.buildClass();
            if(this.edit){
                this.update(this.classs).then(
                    data => {
                        this.setWarning(data.message, { root: true }).then(()=>{
                            this.$router.push('/classProductDetail/'+this.edit)
                        })
                    },
                    error => {
                })
            }else{
                this.create(this.classs).then(
                    data => {
                        this.setWarning(data.message, { root: true }).then(()=>{
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
            attr: state => state.productAttribute.attributes
        }),
    },
  }
</script>

