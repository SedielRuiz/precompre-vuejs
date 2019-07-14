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
                <v-combobox v-model="user.id_type" prepend-icon="email" :items="typesIdentification" label="Tipo de identificación"></v-combobox>
                <v-text-field v-model="user.id_description" prepend-icon="email" name="id_description" label="Número de identificación" type="text"></v-text-field>
                <v-text-field v-model="user.name" prepend-icon="email" name="name" label="Nombres" type="text"></v-text-field>
                <v-text-field v-model="user.last_name" prepend-icon="email" name="last_mame" label="Apellidos" type="text"></v-text-field>
                <v-text-field v-model="user.email" prepend-icon="email" name="email" label="Correo" type="text"></v-text-field>
                <v-combobox v-if="edit!=''" v-model="user.status == 'enable' ? 'Activo' : 'Inactivo'" :items="status" prepend-icon="email" label="Estado"></v-combobox>
                <v-text-field v-if="edit==''" v-model="user.password" prepend-icon="email" name="password" label="Contraseña" type="password"></v-text-field>
                <h2>Atributos</h2><br>
                <div v-if="attributes.length > 0">
                  <v-chip v-for="(attr, index) in attributes" :key="index">{{attr.description}} <v-icon medium @click="removeAttribute(index)">close</v-icon></v-chip>
                </div>
                <br>
                <div class="row col-md-8">
                  <v-card  style="height: 100%;width: 84%; padding: 31px;">
                    <!--TELEFONOS-->
                    <label style="font-size: 18px;">Nuevo teléfono</label><hr>
                    <v-text-field v-model="phone.title" prepend-icon="title" name="title" label="Titulo" type="text"></v-text-field>
                    <v-text-field v-model="phone.number" prepend-icon="email" name="number" label="Número" type="number"></v-text-field>
                    <v-combobox v-model="phone.type" :items="typesPhone" prepend-icon="email" label="Tipo de número"></v-combobox>
                    <v-text-field v-model="phone.extension" prepend-icon="extension" name="extension" label="Extensión" type="text"></v-text-field>
                    <v-text-field v-model="phone.code" prepend-icon="code" name="code" label="Código postal" type="text"></v-text-field>
                    <v-switch v-model="phone.principal" :label="'Principal'"></v-switch>
                    <v-btn color="primary" @click="addAttribute()">Agregar</v-btn>
                    <!--TELEFONOS-->
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
  import {mapActions,mapState} from 'vuex';
  
  export default {
    
    name: 'user-manage',
    data () {
      return {
        product: {},
        productClasss:[],
        attribute:{},
        attributes:[],
        typesPhone: [
          {text: 'Fijo', value:'fijo'},
          {text: 'Celular', value:'movil'}
        ],
        typesIdentification: [
          {text: 'Tarjeta de identidad', value:'ti'},
          {text: 'Cedula de ciudadania', value:'cc'},
          {text: 'Cedula de extranjeria', value:'ce'}
        ],
        status:[
          {text: 'Activo', value:'enabled'},
          {text: 'Inactivo', value:'disabled'},
        ],
        edit:"",
        titleText:""
      }
    },
    watch:{
        pro(val){
          if(val){
            this.product = val;
            this.phones = val.telephones;
          }
        },
    },
    mounted () {
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
            setWarning: 'setWarning',
        }),
        addAttribute(){
          this.attributes.push(this.attribute);
          this.attribute = {};
        },
        removeAttribute(idx){
            this.attributes.splice(idx,1);
            this.attribute = {};
        },
        buildProduct(){
            this.product.product_class = this.productClasss;
            this.product.attributes = this.attributes;
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
      }),
    },
  }
</script>

