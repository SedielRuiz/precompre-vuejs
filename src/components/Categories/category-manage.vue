<template>
  <v-card class="elevation-12">
    <v-toolbar dark color="primary">
      <v-toolbar-title>{{titleText}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="error" @click="closeModal()">Cancelar</v-btn>
    </v-toolbar>
    <v-card-text>
      <v-form>
          <v-text-field :disabled="edit ? true : false" v-model="category.title" prepend-icon="email" name="title" label="Titulo" type="text"></v-text-field>
          <v-text-field v-model="category.name" prepend-icon="email" name="name" label="Nombre" type="text"></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="processCategory()">Guardar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import {mapActions,mapState} from 'vuex';
  
  export default {
    name: 'category-manage',
    data () {
      return {
        category: {},
        titleText:""
      }
    },
    props:['edit', 'id'],
    watch:{
      ct(val){
          if(val){
              this.category = val;
          }
      },
    },
    mounted () {
        if(this.edit && this.id){
            this.titleText="Editar categoria"
            this.getCategory(this.id);
        }else{
          this.titleText="Nuevo categoria"
        }
    },
    methods: {
        ...mapActions({
            create: 'category/create',
            update: 'category/update',
            getCategory: 'category/getCategory',
            setWarning: 'setWarning',
        }),
        processCategory() {
            if(this.edit){
                this.update(this.category).then(
                    data => {
                        this.setWarning(data, { root: true }).then(()=>{
                          this.closeModal();
                        })
                    },
                    error => {
                })
            }else{
                this.create(this.category).then(
                    data => {
                        this.setWarning(data, { root: true }).then(()=>{
                          this.closeModal();
                        })
                    },
                    error => {
                })
            }
        },
        closeModal(){
          this.$emit('redirect', "close")
        }
    },
    computed:{
        ...mapState({
            warning: state => state.warning,
            ct: state => state.category.category 
        }),
    },
  }
</script>

