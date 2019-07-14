<template>
  <v-container>
    <div class="row col-md-10">
        <div class="col-md-8">
            <h1>Clases de atributos</h1>
        </div>
        <div class="col-md-2">
            <v-btn color="success" @click="redirect(false, 0)">Nuevo</v-btn>
        </div>
    </div>
    <hr><br>
    <v-data-table
        :headers="headers"
        :items="rows"
        class="elevation-1">
        <template v-slot:items="props">
        <td>{{ props.item.code }}</td>
        <td v-if="props.item.attributes">{{ props.item.attributes[0].code }}</td>
        <td v-else></td>
        <td v-if="props.item.attributes_customisables">{{ props.item.attributes_customisables[0].code }}</td>
        <td v-else></td>
        <td><v-btn color="primary" @click="redirect(true, props.item._id)">Detalle</v-btn></td>
        </template>
    </v-data-table>
  </v-container>
</template>

<script>
  import {mapActions,mapState} from 'vuex';
  
  export default {
    
    name: 'class-list',
    data () {
      return {
        headers: [
            {text:"Nombre", value:"code"},
            {text:"Atributos", value:"attributes"},
            {text:"Atributos customisables", value:"attributes_customisables"},
            {text:"Acciones", value:"actons"}
        ],
      }
    },
    mounted () {
        this.fetchClasss();
    },
    methods: {
      ...mapActions({
        fetchClasss: 'productClass/fetchClasss',
        setWarning: 'setWarning',
      }),
      redirect(page,id){
        if(!page){
            this.$router.push('/classProductManage')
        }else{
            this.$router.push('/classProductDetail/'+id)
        }
      }
    },
    computed:{
      ...mapState({
        warning: state => state.warning,
        rows: state => state.productClass.classs
      }),
    },
  }
</script>

