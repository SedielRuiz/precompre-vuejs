<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md10>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>{{titleText}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn v-if="edit != ''" color="error" @click="redirect(true)">Cancelar</v-btn>
            <v-btn v-if="edit == 0" color="error" @click="redirect(false)">Cancelar</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <div v-if="filters">
                <div v-for="(f, index) in filters">
                  <v-layout align-center justify-center row wrap>
                      <v-flex xs4 md4>
                        <v-combobox :disabled="true" @change="updateFilter('name', f.name, index, false, false)" v-model="f.name" :items="itemsFilter" prepend-icon="filter_list" label="Filtro"></v-combobox>
                      </v-flex>
                      <v-flex xs4 md4>
                        <v-combobox @change="updateFilter('operator', f.operator, index, false, false)" v-model="f.operator" :items="f.operators " prepend-icon="email" label="Operador"></v-combobox>
                      </v-flex>
                      <v-flex v-if="f.type=='Array'" xs4 md4>
                        <v-combobox v-model="f.selected" :items="f.list" @change="updateFilter('selected', f.selected, index, false, true)" prepend-icon="email" label="Opciones"></v-combobox>
                      </v-flex>
                      <v-flex xs4 md4>
                        <div v-if="f && f.type"> 
                          <div v-if="f.type=='String' || f.type=='Number'">
                            <v-text-field @change="updateFilter('value', f.value, index, false, false)" v-model="f.value" prepend-icon="email" name="name" label="Valor" :type="f.type=='String' ? 'text': 'number'"></v-text-field>
                          </div>
                          <div v-else-if="f.type=='Array'">
                            <div v-if="f.value">
                              <v-chip v-for="lst in f.value" :key="lst.value">{{lst.text}} <v-icon medium @click="updateFilter('value', lst.value, index, true, false)">close</v-icon></v-chip>
                            </div>
                          </div>
                          <div v-else-if="f.type=='Select'">
                            <v-combobox v-model="f.value" :items="status" prepend-icon="email" label="Valor"></v-combobox>
                          </div>
                        </div>
                      </v-flex>
                      <v-icon medium @click="removeFilter(index, false)">close</v-icon>
                  </v-layout>  
                </div>
              </div>
              <v-layout align-center justify-center row wrap>
                <v-flex xs4 md4>
                  <v-combobox v-model="itemFilter" :items="itemsFilter" prepend-icon="filter_list" label="Filtro"></v-combobox>
                </v-flex>
                <v-flex xs4 md4>
                  <v-combobox v-model="filter.operator" :items="operators" prepend-icon="email" label="Operador"></v-combobox>
                </v-flex>
                <v-flex v-if="itemFilter.type=='Array'" xs4 md4>
                  <v-combobox v-model="filter.selected" :items="list" @change="addList(filter.selected)" prepend-icon="email" label="Opciones"></v-combobox>
                </v-flex>
                <v-flex xs4 md4>
                  <div v-if="itemFilter && itemFilter.type"> 
                    <div v-if="itemFilter.type=='String' || itemFilter.type=='Number'">
                      <v-text-field v-model="filter.value" prepend-icon="email" name="name" label="Valor" :type="itemFilter.type=='String' ? 'text': 'number'"></v-text-field>
                    </div>
                    <div v-else-if="itemFilter.type=='Array'">
                      <div v-if="selectedList">
                        <v-chip v-for="(lst, index) in selectedList" :key="index">{{lst.text}} <v-icon medium @click="removeFilter(index, true)">close</v-icon></v-chip>
                      </div>
                    </div>
                    <div v-else-if="itemFilter.type=='Select'">
                      <v-combobox v-model="filter.value" :items="status" prepend-icon="email" label="Valor"></v-combobox>
                    </div>
                  </div>
                </v-flex>
                <v-icon medium @click="addFilter()">add</v-icon>
              </v-layout>
            </v-form>
            <v-btn color="primary" @click="preview()">Vista previa</v-btn>
            <div v-if="customers.length > 0">
              <v-data-table :headers="headers" :items="customers" class="elevation-1">
                <template v-slot:items="props">
                  <td>{{ props.item.name }}</td>
                </template>
              </v-data-table>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="processCustomerList()">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import {mapActions,mapState} from 'vuex';
  
  export default {
    
    name: 'prodcustomeruct-list-manage',
    data () {
      return {
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
        selectedList:[]
      }
    },
    watch:{
        pl(val){
          if(val){
            this.filter = val;
          }
        },
        att(val){
          console.log(val);
        },
        itemFilter(val){
          if(val){
            this.getOperators(val);
            if(val.type == "Array"){
              this.fillList(val.value);
            }
          }
        },
        flts(val){
          for(var s = 0; s < val.schema.length; s++){
            if(val.schema[s].name != "password" && val.schema[s].name != "__v" && (val.schema[s].type == "String" || val.schema[s].type == "Number" || val.schema[s].type == "Array")){
              var type = val.schema[s].type;
              if(val.schema[s].name == "status")
                type = "Select"
              this.itemsFilter.push({"text":val.schema[s].name, "value":val.schema[s].name, "type":type});
            }
          }
          this.opers = val.operators;
        }
    },
    mounted () {
      this.consultModel();
      //this.consultAttributes();
      this.fetchCategories();
      this.edit = this.$route.params.id == undefined ? 0 : this.$route.params.id;
      if(this.edit!=0){
          this.titleText="Editar lista";
          this.getCustomerList(this.edit);
      }else{
        this.titleText="Nueva lista";
      }
    },
    methods: {
        ...mapActions({
            create: 'customerList/create',
            update: 'customerList/update',
            searchCustomers: 'customerList/searchCustomers',             
            getCustomerList: 'customerList/getCustomerList', 
            consultModel: 'customerList/consultModel', 
            consultAttributes: 'customerList/consultAttributes', 
            fetchCategories: 'category/fetchCategories', 
            setWarning: 'setWarning',
        }),
        addList(obj){
          if(obj){
            this.selectedList.push(obj);
            this.filter.selected = "";
          }
        },
        formatList(list, arr, name, value){
          var lst = [];
          for(var s = 0; s < arr.length; s++){
            lst.push({"text": arr[s][name], "value": arr[s][value]});
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
              this.list = this.formatList(fill, this.att, "name", "_id");
              break;
          }
        },
        updateFilter(field, val, idx, arr, select){
          if(arr){
            for(var s = 0; s < this.filters[idx].value.length; s++){
              if(this.filters[idx].value[s].id == val){
                this.filters[idx].value.splice(s, 1);  
              }
            }
          }else if (select){
            this.filters[idx].value.push(val);
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
          this.filters.push(this.filter);
          this.itemFilter = "";
          this.selectedList = [];
          this.filter = {};
          console.log(this.filters);
        },
        removeFilter(idx, item){
          if(item){
            this.selectedList.splice(idx,1);
          }else{
            this.filters.splice(idx,1);
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
          this.filters = this.buildCustomerList();
          this.searchCustomers(this.filters).then(
            data => {
                console.log(data);
            },
            error => {
          });
        },
        buildCustomerList(){
            console.log(this.filters);
            var filtersP = [];
            for(var s = 0; s < this.filters.length; s++){
              var val = [];
              if(this.filters[s].type == "Array"){
                for(var r = 0; r < this.filters[s].value.length; r++){
                  val.push(this.filters[s].value[r.value])
                }
              }else{
                val = this.filters[s].value;
              }
              filtersP.push({"name":this.filters[s].name, "type":this.filters[s].type, "value":val});
            }
            console.log(filtersP);
            return filtersP;
        },
        processCustomerList () {
            this.filters = this.buildCustomerList();
            if(this.edit){
                this.update(this.filters).then(
                    data => {
                        this.setWarning(data, { root: true }).then(()=>{
                            this.$router.push('/productListDetail/'+this.edit)
                        })
                    },
                    error => {
                })
            }else{
                this.create(this.filters).then(
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
          pl: state => state.customerList.customerList, 
          flts: state => state.customerList.listFilter, 
          att: state => state.customerList.listAttribute, 
          cat: state => state.category.categories, 
          customers: state => state.customerList.customers, 
      }),
    },
  }
</script>

