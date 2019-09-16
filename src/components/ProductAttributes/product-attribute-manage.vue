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
                <v-text-field v-model="attribute.code" prepend-icon="person" name="name" label="Nombre" type="text"></v-text-field>
                <v-combobox v-model="attribute.type" :items="types" prepend-icon="reorder" label="Tipo"></v-combobox>
                <div v-if="attribute.type && attribute.type.value === 'boolean' || attribute.type === 'boolean'">
                    <v-switch v-show="false" v-model="attribute.default_value" :label="'Valor por defecto'"></v-switch>
                </div>
                <div v-else>
                    <v-combobox v-model="attribute.size" :items="sizes" prepend-icon="high_quality" label="Tamaño de la caja de texto"></v-combobox>
                    <v-text-field v-show="false" v-model="attribute.length_text" prepend-icon="view_module" name="length_text" label="Longitud" type="text"></v-text-field>
                    <v-text-field v-show="false" v-model="attribute.default_value" prepend-icon="speaker_notes" name="name" label="Valor por defecto" type="text"></v-text-field>
                </div>
                <v-switch v-model="attribute.required" :label="'Requerido'"></v-switch>
                <v-switch v-model="attribute.visible" :label="'Visible'"></v-switch>
                <v-switch v-model="attribute.wysiwyg" :label="'Wysiwyg'"></v-switch>
                <h2>Opciones personalizables</h2>
                <div v-if="options.length > 0">
                  <v-chip v-for="(opc, index) in options" :key="index">{{opc.code}} <v-icon medium @click="removeOption(index)">close</v-icon></v-chip>
                </div>
                <br>
                <div class="row col-md-8">
                  <v-card  style="height: 100%;width: 84%; padding: 31px;">
                    <!--OPCIONES-->
                    <v-text-field v-model="option.code" prepend-icon="title" name="title" label="Opción" type="text"></v-text-field>
                    <v-switch v-if="!option.validate ? option.validated = true : option.validated" v-model="option.validated" :label="'Validado'"></v-switch>
                    <v-btn color="primary" @click="addOption()">Agregar</v-btn>
                    <!--TELEOPCIONESFONOS-->
                  </v-card><br>
                </div>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" :disabled="trySend" style="width: 100%;" @click="processAttribute()">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import {mapActions,mapState} from 'vuex';
  
  export default {
    
    name: 'attribute-manage',
    data () {
      return {
        attribute: {},
        options:[],
        option:{},
        types:[
            {text: 'Texto', value:'text'},
            {text: 'Numerico', value:'number'},
            {text: 'Booleano', value:'boolean'},
            {text: 'Precio', value:'decimal'}
        ],
        sizes:[
            {text: 'Corto', value:'short'},
            {text: 'Mediano', value:'medium'},
            {text: 'Grande', value:'big'}
        ],
        edit:"",
        titleText:""
      }
    },
    watch:{
        att(val){
          if(val){
            this.attribute = val;
            this.options = val.options;
          }
        },
    },
    mounted () {
      this.attribute.visible = true;
        this.edit = this.$route.params.id == undefined ? 0 : this.$route.params.id;
        if(this.edit!=""){
            this.titleText="Editar atributo";
            this.getAttribute(this.edit);
        }else{
          this.titleText="Nuevo atributo";
        }
    },
    methods: {
        ...mapActions({
            create: 'productAttribute/create',
            update: 'productAttribute/update',
            getAttribute: 'productAttribute/getAttribute', 
            setWarning: 'setWarning',
        }),
        addOption(){
          if(this.option.code != ""){
            this.option.code = this.option.code.toLowerCase().split(" ").join("_");
            this.options.push(this.option);
            this.option = {};
          }
        },
        removeOption(idx){
            this.options.splice(idx,1);
            this.option = {};
        },
        buildAttribute(){
          this.attribute.sku = this.attribute.code.substring(0, 3);
          this.attribute.title = this.attribute.code;
          this.attribute.code = this.attribute.code.toLowerCase().split(" ").join("_");
          this.attribute.options = this.options;
          if(this.attribute.size)
              this.attribute.size = this.attribute.size.value;
          if(this.attribute.type)
              this.attribute.type = this.attribute.type.value;

          this.attribute.length_text = 100;
          //this.attribute.default_value = "xxx";
          return this.attribute;
        },
        processAttribute () {
            this.attribute = this.buildAttribute();
            if(this.edit){
                this.update(this.attribute).then(
                    data => {
                      this.setWarning(data, { root: true }).then(()=>{
                          this.$router.push('/atributesProductDetail/'+this.edit)
                      })
                    },
                    error => {
                      console.log(error);
                    })
            }else{
                this.create(this.attribute).then(
                    data => {
                      this.setWarning(data, { root: true }).then(()=>{
                          this.$router.push('/atributesProductList')
                      })
                    },
                    error => {
                })
            }
        },
        redirect(page){
            if(page){
                this.$router.push('/atributesProductDetail/'+this.edit)
            }else{
                this.$router.push('/atributesProductList')
            }
        }
    },
    computed:{
      ...mapState({
          warning: state => state.warning,
          att: state => state.productAttribute.attribute, 
      }),
      trySend(){
        if(this.attribute && this.attribute.type && this.attribute.code && this.attribute.required != ""){
          return false; 
        }
        return true;
      }
    },
  }
</script>

