<template>
  <v-card class="elevation-12">
    <v-toolbar dark color="primary">
      <v-toolbar-title>{{titleText}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="error" @click="closeModal()">Cancelar</v-btn>
    </v-toolbar>
    <v-card-text>
      <v-form>
          <v-text-field v-model="input.name" prepend-icon="title" name="name" label="Nombre" type="text"></v-text-field>
          <v-select prepend-icon="title" v-model="input.metric" :items="metrics" label="Unidad de medida" ></v-select>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="processInput()">Guardar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import {mapActions,mapState} from 'vuex';
  
  export default {
    name: 'input-manage',
    data () {
      return {
        titleText:"",
        input: {},
        metrics:[
          {text: 'Mililitros', value:'mililitros'},
          {text: 'Litros', value:'litros'},
          {text: 'Gramos', value:'gramos'},
        ],
      }
    },
    props:['edit', 'id'],
    watch:{
        inp(val){
            if(val){
                this.input = val;
            }
        },
    },
    mounted () {
        if(this.edit && this.id){
            this.titleText="Editar insumo"
            this.getInput(this.id);
        }else{
          this.titleText="Nuevo insumo"
        }
    },
    methods: {
        ...mapActions({
            create: 'input/create',
            update: 'input/update',
            getInput: 'input/getInput',
            setWarning: 'setWarning',
        }),
        processInput() {
            if(this.edit){
                this.update(this.input).then(
                    data => {
                        this.setWarning(data, { root: true }).then(()=>{
                          this.closeModal();
                        })
                    },
                    error => {
                })
            }else{
                this.create(this.input).then(
                    data => {
                        this.setWarning(data, { root: true }).then(()=>{
                          this.closeModal();
                          this.$router.push('/inputList')
                        })
                    },
                    error => {
                })
            }
        },
        closeModal(){
          this.$emit('redirect', 'close')
        }
    },
    computed:{
        ...mapState({
            warning: state => state.warning,
            inp: state => state.input.input 
        }),
    },
  }
</script>

