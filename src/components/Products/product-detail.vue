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
                <v-text-field :disabled="true" v-model="product.name" prepend-icon="email" name="name" label="Nombre del producto" type="text"></v-text-field>
                <v-text-field :disabled="true" v-if="product.product_class" v-model="product.product_class.code" prepend-icon="email" name="name" label="Clase del producto" type="text"></v-text-field>
                <v-combobox :disabled="true" v-if="edit!=''" v-model="product.status == 'enable' ? 'Activo' : 'Inactivo'" :items="status" prepend-icon="email" label="Estado"></v-combobox>
                <h2>Atributos</h2><br>
                <div v-if="attributes"> 
                    <v-chip v-for="(attr, index) in attributes" :key="index">{{attr.name.charAt(0).toUpperCase() + attr.name.slice(1)}} - {{attr.value.charAt(0).toUpperCase() + attr.value.slice(1)}}</v-chip>
                </div><br>
                <h2>Atributos personalizados</h2><br>
                <div v-if="order_attributes">
                    <v-chip v-for="(attrc, index) in order_attributes" :key="index">{{attrc.name.charAt(0).toUpperCase() + attrc.name.slice(1)}} - {{attrc.value.charAt(0).toUpperCase() + attrc.value.slice(1)}}</v-chip>
                </div><br>
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
            attributes:[],
            order_attributes:[],
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
                    this.formatAttributes("attributes", val.attributes);
                    this.formatAttributes("order_attributes", val.attributes);
                }
            },
        },
        mounted () {
            this.edit = this.$route.params.id == undefined ? 0 : this.$route.params.id;
            if(this.edit!=""){
                this.getProduct(this.edit);
            }
        },
        methods: {
            ...mapActions({
                getProduct: 'product/getProduct', 
                setWarning: 'setWarning',
            }),
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
                pro: state => state.product.product,
            }),
        },
    }
</script>

