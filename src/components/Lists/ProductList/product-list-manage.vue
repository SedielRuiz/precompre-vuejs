<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md12>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>{{titleText}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn v-if="edit != ''" color="error" @click="redirect(true)">Cancelar</v-btn>
            <v-btn v-if="edit == 0" color="error" @click="redirect(false)">Cancelar</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field v-model="nameFilter" prepend-icon="title" name="title" label="Nombre" type="text"></v-text-field>
              <div v-if="filters">
                <div v-for="(f, index) in filters">
                  <v-layout align-center justify-center row wra>
                      <v-flex xs4 md4>
                        <v-combobox :disabled="true" @change="updateFilter('name', f.name, index, false, false)" v-model="f.name" :items="itemsFilter" prepend-icon="filter_list" label="Filtro"></v-combobox>
                      </v-flex>
                      <v-flex xs4 md4>
                        <v-combobox @change="updateFilter('operator', f.operator, index, false, false)" v-model="f.operator" :items="f.operators " prepend-icon="group_work" label="Operador"></v-combobox>
                      </v-flex>
                      <v-flex v-if="f.type=='Array'" xs4 md4>
                        <div v-if="f.name == 'attributes'">
                          <v-combobox v-model="f.optionsAttributes.attr" :items="f.list" @change="updateFilter('optionsAttributes.attr', f.optionsAttributes.attr, index, false, true)" prepend-icon="email" label="Atributos"></v-combobox>
                        </div>
                        <div v-else>
                          <v-combobox v-model="f.selected" :items="f.list" @change="updateFilter('selected', f.selected, index, false, true)" prepend-icon="email" label="Opciones"></v-combobox>
                        </div>
                      </v-flex>
                      <v-flex xs4 md4>
                        <div v-if="f && f.type"> 

                          <div v-if="f.type=='String' || f.type=='Number'">
                            <v-text-field @change="updateFilter('value', f.value, index, false, false)" v-model="f.value" prepend-icon="email" name="name" label="Valor" :type="f.type=='String' ? 'text': 'number'"></v-text-field>
                          </div>
                          <div v-else-if="f.type=='Array'">
                            <div v-if="f.value && f.name != 'attributes'">
                              <v-layout row wra>
                                <v-chip v-for="lst in f.value" :key="lst.value">{{lst.text}} <v-icon medium @click="updateFilter('value', lst.value, index, true, false)">close</v-icon></v-chip>
                              </v-layout>
                            </div>
                            <div v-else>
                              <div v-if="f.optionsAttributes && f.optionsAttributes && f.optionsAttributes.options.length > 0">
                                <v-combobox v-model="f.optionsAttributes.opc" @change="updateFilter('f.optionsAttributes.opc', f.optionsAttributes.opc, index, false, true)" :items="f.optionsAttributes.options" prepend-icon="filter_list" label="Opciones"></v-combobox>
                              </div>
                              <div v-else>
                                <div v-if="f.optionsAttributes.type == 'boolean'">
                                      <v-switch prepend-icon="title" v-model="f.optionsAttributes.opc" :label="f.optionsAttributes.code"></v-switch>
                                  </div>
                                  <div v-else>
                                      <div v-if="f.optionsAttributes.size === 'short'">
                                          <v-text-field v-model="f.optionsAttributes.opc" name="title" label="Valor" type="text"></v-text-field>
                                      </div>
                                      <div v-else-if="f.optionsAttributes.size === 'medium'">
                                          <v-textarea v-model="f.optionsAttributes.opc" height="77px" solo name="mediumText" label="Escriba un valor y especifique tipos de medias..."></v-textarea>
                                      </div>
                                      <div v-else-if="f.optionsAttributes.size === 'big'">
                                          <v-textarea v-model="f.optionsAttributes.opc" height="135px" solo name="mediumText" label="Escriba un valor y especifique tipos de medias..."></v-textarea>
                                      </div>
                                  </div>
                              </div>
                            </div>
                          </div>
                          <div v-else-if="f.type=='Select'">
                            <v-combobox v-model="f.value" :items="status" prepend-icon="email" label="Valor"></v-combobox>
                          </div>
                          
                        </div>
                      </v-flex>
                      <div v-show="f.name == 'attributes' ? true : false">
                        <v-layout row wra>
                            <v-chip v-for="lst in f.value" :key="lst.value">{{lst.text}} <v-icon medium @click="updateFilter('value', lst.value, index, true, false)">close</v-icon></v-chip>
                        </v-layout>
                      </div>
                      <v-icon medium @click="removeFilter(index, false)">close</v-icon>
                  </v-layout>  
                </div>
              </div>
              <v-layout align-center justify-center row wra>
                <v-flex xs4 md4>
                  <v-combobox v-model="itemFilter" :items="itemsFilter" prepend-icon="filter_list" label="Filtro"></v-combobox>
                </v-flex>
                <v-flex xs4 md4>
                  <v-combobox v-model="filter.operator" :items="operators" prepend-icon="group_work" label="Operador"></v-combobox>
                </v-flex>
                <v-flex v-if="itemFilter.type=='Array'" xs4 md4>
                  <div v-if="itemFilter.value == 'attributes'">
                    <v-combobox v-model="filter.selected" :items="list" @change="addList(filter.selected, true)" prepend-icon="email" label="Atributos"></v-combobox>
                  </div>
                  <div v-else>
                    <v-combobox v-model="filter.selected" :items="list" @change="addList(filter.selected)" prepend-icon="email" label="Opciones"></v-combobox>
                  </div>
                </v-flex>
                <v-flex xs4 md4>
                  <div v-if="itemFilter && itemFilter.type"> 
                    <div v-if="itemFilter.type=='String' || itemFilter.type=='Number'">
                      <v-text-field v-model="filter.value" prepend-icon="email" name="name" label="Valor" :type="itemFilter.type=='String' ? 'text': 'number'"></v-text-field>
                    </div>
                    <div v-else-if="itemFilter.type=='Array'">
                      <div v-if="selectedList && itemFilter.value != 'attributes'">
                        <v-layout row wra>
                          <v-chip v-for="(lst, index) in selectedList" :key="index">{{lst.text}} <v-icon medium @click="removeFilter(index, true)">close</v-icon></v-chip>
                        </v-layout>
                      </div>
                      <div v-else>
                        <div v-if="filter.selected && optionsAttributes && optionsAttributes.options.length > 0">
                          <v-combobox v-model="optionsAttributes.opc" @change="addList(optionsAttributes.opc, false, true)" :items="optionsAttributes.options" prepend-icon="filter_list" label="Opciones"></v-combobox>
                        </div>
                        <div v-else>
                          <div v-if="optionsAttributes.type == 'boolean'">
                                <v-switch prepend-icon="title" v-model="optionsAttributes.opc" :label="optionsAttributes.code"></v-switch>
                            </div>
                            <div v-else>
                                <div v-if="optionsAttributes.size === 'short'">
                                    <v-text-field v-model="optionsAttributes.opc" name="title" label="Valor" type="text"></v-text-field>
                                </div>
                                <div v-else-if="optionsAttributes.size === 'medium'">
                                    <v-textarea v-model="optionsAttributes.opc" height="77px" solo name="mediumText" label="Escriba un valor y especifique tipos de medias..."></v-textarea>
                                </div>
                                <div v-else-if="optionsAttributes.size === 'big'">
                                    <v-textarea v-model="optionsAttributes.opc" height="135px" solo name="mediumText" label="Escriba un valor y especifique tipos de medias..."></v-textarea>
                                </div>
                            </div>
                        </div>
                      </div>
                    </div>
                    <div v-else-if="itemFilter.type=='Select'">
                      <v-combobox v-model="filter.value" :items="status" prepend-icon="email" label="Valor"></v-combobox>
                    </div>
                  </div>
                </v-flex>
                <div v-show="itemFilter && itemFilter.value == 'attributes' ? true : false" v-if="filter.operator">
                  <v-layout row wra>
                      <v-chip v-for="(lst, index) in selectedList" :key="index">{{lst.text}} <v-icon medium @click="removeFilter(index, true)">close</v-icon></v-chip>
                  </v-layout>
                </div>
                <v-flex xs1 md1>
                  <v-icon medium @click="addFilter()">add</v-icon>
                </v-flex>
              </v-layout>
              <!--v-if="itemFilter && itemFilter.value == 'attributes'"  -->
            </v-form>
            <v-btn color="primary" @click="preview()">Vista previa</v-btn>
            <div v-if="products.length > 0">
              <v-data-table :headers="headers" :items="products" class="elevation-1">
                <template v-slot:items="props">
                  <td>{{ props.item.name }}</td>
                </template>
              </v-data-table>
              <pagination @search="search" :total_pages="total_pages" :total_items="total_items" :page_size="page_size"></pagination>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" :disabled="trySend" style="width: 100%;" @click="processProductList()">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import {mapActions,mapState} from 'vuex';
  import pagination from '@/components/Pagination';

  export default {
    name: 'product-list-manage',
    components: {
      pagination,
    },
    data () {
      return {
        nameFilter:"",
        headers: [
            {text:"Nombres", value:"name"},
            {text:"Estado", value:"status"},
        ],
        status:[
          {text: 'Activo', value:'enabled'},
          {text: 'Inactivo', value:'disabled'},
        ],
        filter: {},
        filters:[],
        itemFilter:"",
        edit:"",
        titleText:"",
        opers:[],
        operators: [],
        list:[],
        itemsFilter:[],
        selectedList:[],
        optionsAttributes:{}
      }
    },
    watch:{
        pl(val){
          if(val){
            this.nameFilter = val.model_list[0].title;
            if(val.model_list[0].filter){
              this.searchProducts({"filter":val.model_list[0].filter});
              this.formatFilters(val.model_list[0].filter);
              this.filters.id = val.model_list[0]._id;
            }
          }
        },
        itemFilter(val){
          if(val){
            this.selectedList = [];
            this.filter.selected = "";
            this.getOperators(val);
            if(val.type == "Array"){
              this.fillList(val.value);
            }
          }
        },
        flts(val){
          if(val){
            for(var s = 0; s < val.schema.length; s++){
              if(val.schema[s].name != "__v" && (val.schema[s].type == "String" || val.schema[s].type == "Number" || val.schema[s].type == "Array")){
                var type = val.schema[s].type;
                if(val.schema[s].name == "status")
                  type = "Select"
                this.itemsFilter.push({"text":val.schema[s].name, "value":val.schema[s].name, "type":type});
              }
            }
            this.opers = val.operators;
          }
        }
    },
    mounted () {
      this.consultModel();
      this.consultAttributes({"search":"b"});
      this.fetchCategories();
      this.edit = this.$route.params.id == undefined ? 0 : this.$route.params.id;
      if(this.edit!=0){
          this.titleText="Editar lista";
          this.getProductList(this.edit);
      }else{
        this.titleText="Nueva lista";
      }
    },
    methods: {
      ...mapActions({
        create: 'productList/create',
        update: 'productList/update',
        searchProducts: 'productList/searchProducts',             
        getProductList: 'productList/getProductList', 
        consultModel: 'productList/consultModel', 
        consultAttributes: 'productList/consultAttributes', 
        fetchCategories: 'category/fetchCategories', 
        setWarning: 'setWarning',
      }),
      formatFilters(filters){
        var f = [];
        for(var s = 0; s < filters.length; s++){
          //Operadores por filtro
          if(filters[s].name == "status"){
            filters[s].type = "Select";
            this.getOperators({"type":"Select"});
            filters[s].value = this.status.find(element=>{return element.value == filters[s].value });
          }else{
            this.getOperators({"type":filters[s].type});
          }
          filters[s].operators = this.operators;
          filters[s].operator = this.operators.find(element=>{return element.value == filters[s].operator });
          //Listas
          this.fillList(filters[s].name);
          filters[s].lists = this.list;
          //Selected
          filters[s].selected = "";
          console.log(filters[s]);
          if(filters[s].type == "Array"){
            if(filters[s].name == "attributes"){
              filters[s].optionsAttributes = this.list.find(element=>{return element.value == filters[s].value[0].name });
              filters[s].optionsAttributes.attr = this.list.find(element=>{return element.value == filters[s].value[0].name }).code;
              for(var r = 0; r < filters[s].value.length; r++){
                filters[s].value[r] = {"text":filters[s].value[r].value, "value":filters[s].value[r].value};
              }
            }else{
              for(var r = 0; r < filters[s].value.length; r++){
                console.log(filters[s].value);
                filters[s].value[r] = {"text":this.list.find(element=>{return element.value == filters[s].value[r]}).text, "value":filters[s].value[r]};
              }
            }
          }
          f.push(filters[s]);
        }
        this.filters = f;
        this.operators = [];
        this.list = [];
        console.log(this.filters);
      },
      search(pagination){
        this.fetchProductLists(pagination);
      },
      addList(obj, opc = false, att = false){
        if(obj){
          if(opc){
            this.selectedList = [];
            var opcs = [];
            this.optionsAttributes = {};
            console.log(obj.options);
            if(obj.options && obj.options.length > 0){
              for(var s = 0; s < obj.options.length; s++){
                if(!obj.options[0].code)
                  break;
                opcs.push({"text":obj.options[s].code, "value":obj.options[s].code});
              }
            }
            this.optionsAttributes = obj;
            this.optionsAttributes.options = obj.options.length > 0 && obj.options[0].code ? opcs : obj.options;
            this.optionsAttributes.attr = this.filter.selected.code;
          }else{
            var n = this.selectedList.find(element=>{return element.value == obj.value });
            if(!n){
              this.selectedList.push(obj);
            }
            if(att){
              this.optionsAttributes.opc = "";
            }else{
              this.filter.selected = "";
            }
          }
        }
      },
      formatList(list, arr, name, value){
        var lst = [];
        var opc = [];
        var type = "";
        var code = "";
        var size = "";
        for(var s = 0; s < arr.length; s++){
          opc = arr[s].options ? arr[s].options : opc;
          type = arr[s].type ? arr[s].type : type;
          code = arr[s].code ? arr[s].code : code;
          size = arr[s].size ? arr[s].size : size;
          lst.push({"text": arr[s][name], "value": arr[s][value], "options":opc, "type":type, "code":code, "size":size});
        }
        return lst;
      },
      fillList(fill){
        this.list = [];
        switch(fill){
          case "categories":
            this.list = this.formatList(fill, this.cat, "name", "_id");
            break;
          case "attributes":
            this.list = this.formatList(fill, this.att, "code", "_id");
            break;
        }
      },
      updateFilter(field, val, idx, arr, select){
        if(arr){
          for(var s = 0; s < this.filters[idx].value.length; s++){
            if(this.filters[idx].value[s].value == val){
              this.filters[idx].value.splice(s, 1);  
            }
          }
        }else if (select){
          console.log(this.filters[idx]);
          var n = this.filters[idx].value.find(element=>{return element.text == val.text });
          if(!n){
            this.filters[idx].value.push(val);
          }
          this.filters[idx].selected = "";
        }else{
          this.filters[idx][field] = val; 
        }
      },
      addFilter(){
        this.filter.name = this.itemFilter.value;
        this.filter.operator = this.filter.operator;
        this.filter.operators = this.operators;
        this.filter.type = this.itemFilter.type;
        if(this.filter.type == "Array"){
          this.filter.value = this.selectedList;
          this.filter.list = this.list;
        }
        this.filter.optionsAttributes = this.optionsAttributes;
        this.filters.push(this.filter);
        this.itemFilter = "";
        this.selectedList = [];
        this.filter = {};
        this.filters.push();
        console.log(this.filters);
      },
      removeFilter(idx, item){
        if(item){
          this.selectedList.splice(idx,1);
          this.selectedList.push();
        }else{
          this.filters.splice(idx,1);
          this.filters.push();
        }
      },
      getOperators(item){
        this.operators = [];
        for(var s = 0; s < this.opers.length; s++){
          if(this.opers[s][item.type]){
            this.operators = this.opers[s][item.type];
            break;
          }
          if(item.type == "Array" && this.opers[s]["String"]){
            this.operators = this.opers[s]["String"];
            break;
          }
          if(item.type == "Select"){
            this.operators = [{"text":"Igual", "value":"ep"}, {"text":"Diferente", "value":"no_cont"}];
            break;
          }
        }
      },
      preview(){
        var filterView = this.buildProductList();
        this.searchProducts({"filter":filterView.filter}).then(
          data => {
            console.log(data);
          },
          error => {
        });
      },
      buildProductList(){
          console.log(this.filters);
          var filtersP = [];
          for(var s = 0; s < this.filters.length; s++){
            var val = [];
            if(this.filters[s].type == "Array"){
              for(var r = 0; r < this.filters[s].value.length; r++){
                if(this.filters[s].name == "attributes"){
                  val.push({"name": this.filters[s].optionsAttributes.value, "value":this.filters[s].value[r].value});
                }else{
                  val.push(this.filters[s].value[r].value);
                }
              }
            }else{
              val = this.filters[s].value && this.filters[s].value.value ? this.filters[s].value.value : this.filters[s].value;
            }
            filtersP.push({"name":this.filters[s].name, "type":this.filters[s].type =="Select" ? "String" : this.filters[s].type, "operator":this.filters[s].operator && this.filters[s].operator.value ? this.filters[s].operator.value : this.filters[s].operator, "value":val});
          }
          console.log(filtersP);
          return {"_id":this.filters["id"], "title":this.nameFilter, "filter":filtersP};
      },
      processProductList () {
          var filterFin = this.buildProductList();
          if(this.edit){
              this.update(filterFin).then(
                data => {
                    this.setWarning(data, { root: true }).then(()=>{
                        this.$router.push('/productListDetail/'+this.edit)
                    })
                },
                error => {
              })
          }else{
              this.create(filterFin).then(
                data => {
                    this.setWarning(data, { root: true }).then(()=>{
                        this.$router.push('/productListList')
                    })
                },
                error => {
              })
          }
      },
      redirect(page){
          if(page){
              this.$router.push('/productListDetail/'+this.edit)
          }else{
              this.$router.push('/productListList')
          }
      }
    },
    computed:{
      ...mapState({
          warning: state => state.warning,
          pl: state => state.productList.productList, 
          flts: state => state.productList.listFilter, 
          att: state => state.productList.listAttribute, 
          cat: state => state.category.categories, 
          products: state => state.productList.products,
          page_size: state => state.productList.page_size,
          total_items: state => state.productList.total_items,
          total_pages: state => state.productList.total_pages,
      }),
      trySend(){
        if(this.nameFilter && this.filters.length > 0){
          return false; 
        }
        return true;
      }
    },
  }
</script>

