<template>
  <v-container>
    <div class="row col-md-10">
        <div class="col-md-8">
            <h1>Clases de producto</h1>
        </div>
        <div class="col-md-2">
            <v-btn color="success" @click="redirect(false, 0)">Nuevo</v-btn>
        </div>
    </div>
    <hr><br>
    <v-data-table
        :headers="headers"
        :items="rows"
        hide-actions disable-initial-sort
        class="elevation-1">
        <template v-slot:items="props">
        <td>{{ props.item.code }}</td>
        <td>
          <span style="display: inline-block" v-for="(attr, index) of attributes[props.index]"> {{ attr.info.title }} ({{attr.variable ? "variable" : "estatico" }}){{ index===attributes[props.index].length-1 ? "." : ",   " }} </span>
        </td>
        <td>
          <span v-for="(attrC, index) of attributesCustomisables[props.index]"> {{attrC.info.title}} ({{attrC.pivot ? "permutable" : "personalizable" }}){{ index===attributesCustomisables[props.index].length-1 ? "." : ",   " }} </span>
        </td>
        <td>
          <v-icon medium @click="redirect(true, props.item._id)"tooltip="Detalle">more_vert</v-icon>
          <v-icon style="color:#bf1526;" medium @click="deleteClass(props.item._id)">delete</v-icon>
        </td>
        </template>
    </v-data-table>
    <pagination @search="search" :total_pages="total_pages" :total_items="total_items" :page_size="page_size"></pagination>
  </v-container>
</template>

<script>
  import {mapActions,mapState,mapGetters} from 'vuex';
  import pagination from '@/components/Pagination';
  
  export default {
    name: 'class-list',
    components: {
      pagination,
    },
    data () {
      return {
        headers: [
            {text:"Nombre", value:"code"},
            {text:"Atributos", vale:"attributes"},
            {text:"Atributos Per.", vale:"order_attributes"},
            {text:"Acciones", value:"actons"}
        ],
        attributesId:[],
        attributesCustomisablesId:[],
      }
    },
    watch:{
        rows(val){
            if(val){
              for(let i in val){
                this.attributesId.push(val[i].attributes);
                this.attributesCustomisablesId.push(val[i].order_attributes);
              }
            }
        }
    },
    mounted () {
      this.fetchClasss();
      this.fetchAttributes();
    },
    methods: {
      ...mapActions({
        fetchClasss: 'productClass/fetchClasss',
        delete: 'productClass/delete',
        setWarning: 'setWarning',
        fetchAttributes: 'productAttribute/fetchAttributes',
      }),
      deleteClass(id){
        if(confirm("¿ Seguro que desea eliminar este registro ? ")){
          this.delete(id).then(
            data => {
              this.setWarning(data, { root: true }).then(()=>{
                  this.fetchClasss();
              })
            },
            error => {
              console.log(error);
            });
        }
      },
      search(pagination){
        this.fetchClasss(pagination);
      },
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
        rows: state => state.productClass.classs,
        page_size: state => state.productClass.page_size,
        total_items: state => state.productClass.total_items,
        total_pages: state => state.productClass.total_pages,
        att: state => state.productAttribute.attributes, 
      }),
      ...mapGetters({
          getAttributes: 'productAttribute/getAttributes', 
      }),
      attributes(){
            var attrs = [];
              if(this.attributesId && this.att){
                for(var s in this.attributesId){
                  attrs.push([]);
                  for(var k in this.attributesId[s]){
                    if(this.attributesId[s][k])
                      attrs[s].push({ info: this.getAttributes(this.attributesId[s][k].id), variable: this.attributesId[s][k].variable});
                  }
                } 
                return attrs;
              }
        },
        attributesCustomisables(){
          var attrC = [];
          if(this.attributesCustomisablesId  && this.att){
            for(var s in this.attributesCustomisablesId ){
              attrC.push([]);
              for(var k in this.attributesCustomisablesId [s]){
                if(this.attributesCustomisablesId [s][k])
                  attrC[s].push({ info: this.getAttributes(this.attributesCustomisablesId [s][k].id), pivot: this.attributesCustomisablesId [s][k].pivot});
              }
            } 
            return attrC;
          }
        }
    },
  }
</script>

