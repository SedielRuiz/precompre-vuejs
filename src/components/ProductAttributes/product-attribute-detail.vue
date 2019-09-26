<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md10>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Detalle de atributo</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="success" @click="redirect(true)">Editar</v-btn>
            <v-btn color="success" @click="redirect(false)">Volver</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form>
                <v-text-field readonly v-model="attribute.code" prepend-icon="person" name="name" label="Nombre" type="text"></v-text-field>
                <v-layout row wrap>
                  <v-flex xs12 md6>
                    <v-combobox readonly v-model="attribute.type" :items="types" prepend-icon="reorder" label="Tipo"></v-combobox>
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-text-field readonly v-model="attribute.size" prepend-icon="high_quality" name="size" label="Tamaño" type="text"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-text-field v-show="false" readonly v-model="attribute.length_text" prepend-icon="view_module" name="length_text" label="Longitud" type="text"></v-text-field>
                <div v-if="attribute.type && attribute.type.value == 'text'">
                    <v-combobox readonly v-model="attribute.size" :items="sizes" prepend-icon="high_quality" label="Tamaño de la caja de texto"></v-combobox>
                    <v-text-field v-show="false" readonly v-model="attribute.length_text" prepend-icon="view_module" name="length_text" label="Longitud" type="text"></v-text-field>
                </div>
                <v-text-field v-show="false" readonly v-model="attribute.default_value" prepend-icon="speaker_notes" name="name" label="Valor por defecto" type="text"></v-text-field>
                <v-layout row wrap>
                  <v-flex xs12 md6>
                    <v-switch readonly v-model="attribute.required" :label="'Requerido'"></v-switch>
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-switch readonly v-model="attribute.visible" :label="'Visible'"></v-switch>
                  </v-flex>
                </v-layout>
                <h2>Opciones</h2>
                <div v-if="options.length > 0">
                  <v-chip v-for="(opc, index) in options" :key="index">{{opc.code}}</v-chip>
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
  import {mapActions,mapState} from 'vuex';
  
  export default {
    
    name: 'attribute-manage',
    data () {
      return {
        attribute: {},
        options:[],
        types:[
            {text: 'String', value:'text'},
            {text: 'Numerico', value:'number'},
            {text: 'Booleano', value:'bool'},
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
        this.edit = this.$route.params.id == undefined ? 0 : this.$route.params.id;
        if(this.edit!=""){
            this.getAttribute(this.edit);
        }
    },
    methods: {
        ...mapActions({
            getAttribute: 'productAttribute/getAttribute', 
            setWarning: 'setWarning',
        }),
        redirect(page){
            if(page){
                this.$router.push('/atributesProductManage/'+this.edit)
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
    },
  }
</script>

