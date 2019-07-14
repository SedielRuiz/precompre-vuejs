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
                <v-text-field :disabled="true" v-model="classs.code" prepend-icon="email" name="code" label="Nombre" type="text"></v-text-field>
                <v-text-field :disabled="true" v-if="classParent" v-model="classParent.code" prepend-icon="email" name="code" label="Parent clase" type="text"></v-text-field>
                <h2>Atributos</h2><br>
                <div class="row col-md-8">
                  <v-card style="height: 100%;width: 84%; padding: 31px;">
                    <!--ATRIBUTOS-->
                    <div v-if="attributes">
                        <v-chip v-for="(attr, index) in attributes" :key="index">{{attr.code}}</v-chip>
                    </div>
                    <!--ATRIBUTOS-->
                  </v-card><br>
                </div>
                <h2>Atributos personalizables</h2><br>
                <div class="row col-md-8">
                  <v-card style="height: 100%;width: 84%; padding: 31px;">
                    <!--ATRIBUTOS-->
                    <div v-if="attributesCustomisables">
                        <v-chip v-for="(attrC, index) in attributesCustomisables" :key="index">{{attrC.code}}</v-chip>
                    </div>
                    <!--ATRIBUTOS-->
                  </v-card><br>
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
        this.edit = this.$route.params.id == undefined ? 0 : this.$route.params.id;
        if(this.edit!=""){
            this.getClass(this.edit);
        }
    },
    methods: {
        ...mapActions({
            getClass: 'productClass/getClass', 
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
            if(this.attributesId){
                for(var s in this.attributesId){
                    if(this.attributesId[s])
                        attrs.push(this.getAttributes(this.attributesId[s]));
                }
                return attrs;
            }
        },
        attributesCustomisables(){
            var attrsC = [];
            if(this.attributesCustomisablesId){
                for(var s in this.attributesCustomisablesId){
                    if(this.attributesCustomisablesId[s])
                        attrsC.push(this.getAttributes(this.attributesCustomisablesId[s]));
                }
                return attrsC;
            }
        }
    },
  }
</script>

