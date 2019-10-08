<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md10>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Detalle clases de produto</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="success" @click="redirect(true)">Editar</v-btn>
            <v-btn color="success" @click="redirect(false)">Volver</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form>
                <v-text-field readonly v-model="classs.code" prepend-icon="person" name="code" label="Nombre" type="text"></v-text-field>
                <v-text-field readonly v-if="classParent" v-model="classParent.code" prepend-icon="ballot" name="code" label="Parent clase" type="text"></v-text-field>
                <h2>Atributos</h2><hr><br>
                <div class="row col-md-8">
                    <!--ATRIBUTOS-->
                    <v-data-table
                      :headers="headers_attrs"
                      :items="attributes"
                      hide-actions disable-initial-sort
                      class="elevation-1">
                      <template v-slot:items="props">
                        <td>{{ props.item.info.code }}</td>
                        <td>{{ props.item.info.type }}</td>
                        <td>{{ props.item.variable ? 'Si' : 'No'}}</td>
                        <td>{{ props.item.info.visible ? 'Si' : 'No'}}</td>
                        <td>{{ props.item.info.required ? 'Si' : 'No'}}</td>
                        <td> 
                          <p style="max-width: 250px;overflow-x:auto">
                            <span v-for="(option, index) of props.item.info.options"> {{ option.code }}{{ index===props.item.info.options.length-1 ? "." : ",   " }}  </span>
                          </p>
                        </td>
                      </template>
                    </v-data-table>
                    <!--ATRIBUTOS-->
                    <br>
                </div>
                <h2>Atributos personalizables</h2><hr><br>
                <div class="row col-md-8">
                    <!--ATRIBUTOS-->
                    <v-data-table
                      :headers="headers_attrsC"
                      :items="attributesCustomisables"
                      hide-actions disable-initial-sort
                      class="elevation-1">
                      <template v-slot:items="props">
                        <td>{{ props.item.info.code }}</td>
                        <td>{{ props.item.info.type }}</td>
                        <td>{{ props.item.pivot ? 'Si' : 'No'}}</td>
                        <td>{{ props.item.info.visible ? 'Si' : 'No'}}</td>
                        <td>{{ props.item.info.required ? 'Si' : 'No'}}</td>
                        <td> 
                          <p style="max-width: 250px;overflow-x:auto">
                            <span v-for="(option, index) of props.item.info.options"> {{ option.code }}{{ index===props.item.info.options.length-1 ? "." : ",   " }}  </span>
                          </p>
                        </td>
                      </template>
                    </v-data-table>
                    <!--ATRIBUTOS-->
                    <br>
                </div>
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
  import {mapActions,mapState,mapGetters} from 'vuex';
  
  export default {
    
    name: 'rol-detail',
    data () {
      return {
        headers_attrs: [
            {text:"Nombre", value:"code"},
            {text:"Tipo", value:"type"},
            {text:"Variable", value:"viariable"},
            {text:"Visible", value:"visible"},
            {text:"Requerido", value:"required"},
            {text:"Opciones", value:"options"},
        ],
        headers_attrsC: [
            {text:"Nombre", value:"code"},
            {text:"Tipo", value:"type"},
            {text:"Permutable", vale:"permutable"},
            {text:"Visible", value:"visible"},
            {text:"Requerido", value:"required"},
            {text:"Opciones", value:"options"},
        ],
        classs: {},
        attributesId:[],
        attributesCustomisablesId:[],
        edit:""
      }
    },
    watch:{
        cl(val){
            if(val){
                this.classs = val;
                this.attributesId = val.attributes;
                this.attributesCustomisablesId = val.order_attributes;
            }
        }
    },
    mounted () {
      this.fetchAttributes();
        this.edit = this.$route.params.id == undefined ? 0 : this.$route.params.id;
        if(this.edit!=""){
            this.getClass(this.edit);
        }
    },
    methods: {
        ...mapActions({
            getClass: 'productClass/getClass', 
            fetchAttributes: 'productAttribute/fetchAttributes',
            setWarning: 'setWarning',
        }),
        redirect(page){
            if(page){
                this.$router.push('/classProductManage/'+this.edit)
            }else{
                this.$router.push('/classProductList')
            }
        }
    },
    computed:{
        ...mapState({
            warning: state => state.warning,
            cl: state => state.productClass.class, 
            att: state => state.productAttribute.attributes, 
        }),
        ...mapGetters({
            getAttributes: 'productAttribute/getAttributes', 
            getProductClass: 'productClass/getProductClass', 
        }),
        classParent(){
            if(this.classs)
                return this.getProductClass(this.classs.parent);
        },
        attributes(){
            var attrs = [];
            if(this.attributesId && this.att){
                for(var s in this.attributesId){
                    if(this.attributesId[s])
                        attrs.push({ info: this.getAttributes(this.attributesId[s].id), variable: this.attributesId[s].variable});
                }
                return attrs;
            }
        },
        attributesCustomisables(){
            var attrsC = [];
            if(this.attributesCustomisablesId && this.att){
                for(var s in this.attributesCustomisablesId){
                    if(this.attributesCustomisablesId[s])
                        attrsC.push({ info: this.getAttributes(this.attributesCustomisablesId[s].id), pivot: this.attributesCustomisablesId[s].pivot } );
                }
                return attrsC;
            }
        }
    },
  }
</script>

