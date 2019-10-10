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
          <v-btn
            class="elevation-0"
            color="transparent"
            light
            @click="seeAttritbutes(attributes[props.index], 'variables')"
            v-if="attributes[props.index]&&attributes[props.index].length>0"
            >
            <v-icon>list</v-icon>
          </v-btn>
        </td>
        <td>
          <v-btn
            class="elevation-0"
            color="transparent"
            light
            @click="seeAttritbutes(attributesCustomisables[props.index], 'permutables')"
            v-if="attributesCustomisables[props.index]&&attributesCustomisables[props.index].length>0"
            >
            <v-icon>list</v-icon>
          </v-btn>
        </td>
        <td>
          <v-icon medium @click="redirect(true, props.item._id)"tooltip="Detalle">more_vert</v-icon>
          <v-icon style="color:#bf1526;" medium @click="deleteClass(props.item._id)">delete</v-icon>
        </td>
        </template>
    </v-data-table>
    <pagination @search="search" :total_pages="total_pages" :total_items="total_items" :page_size="page_size"></pagination>
    <v-dialog width="400" v-model="viewAttributes">
      <attributeList :attributes="attributesInfo" :headers="headers_dialog"></attributeList>
    </v-dialog>
  </v-container>
</template>

<script>
  import {mapActions,mapState,mapGetters} from 'vuex';
  import pagination from '@/components/Pagination';
  import attributeList from '@/components/ProductClass/product-class-attribute-list';
  
  export default {
    name: 'class-list',
    components: {
      pagination,
      attributeList
    },
    data () {
      return {
        headers: [
            {text:"Nombre", value:"code"},
            {text:"Atributos estaticos", vale:"attributes"},
            {text:"Atributos personalizables", vale:"order_attributes"},
            {text:"Acciones", value:"actons"}
        ],
        attributesId:[],
        attributesCustomisablesId:[],
        attributesInfo: [],
        viewAttributes: false,
        headers_dialog: [
            {text:"Nombre", value:"info.code"},
            {text:"", value:""},
        ]
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
      },
      seeAttritbutes(attributes,type){
        this.viewAttributes = true;
        switch(type){
          case "variables":
            this.attributesInfo = attributes;
            this.headers_dialog[1] = { text: "Variable", value: "variable" }
            break;
          case "permutables":
            this.attributesInfo = attributes;
            this.headers_dialog[1] = { text: "permite permutación", value: "pivot" }
            break;
        }
      }
    },
    computed:{
      ...mapState({
        warning: state => state.warning,
        rows: state => state.productClass.classs,
        page_size: state => state.productClass.page_size,
        total_items: state => state.productClass.total_items, 
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

