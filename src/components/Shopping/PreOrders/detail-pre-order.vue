<template>
  <v-card class="elevation-12">
    <v-toolbar dark color="primary">
      <v-toolbar-title>Editar pre orden</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="error" @click="closeModal()">Cerrar</v-btn>
    </v-toolbar>
    <v-card-text>
        <v-form>
            <v-card class="pa-2" outlined tile v-if="sc">
                <v-layout row wrap>
                    <v-flex xs12 md1>
                        <v-text-field v-model="sc[0].quantity" name="quantity" label="Cantidad" type="number"></v-text-field>
                    </v-flex> 
                    <v-flex xs12 md3>
                        <v-combobox :disabled="true" prepend-icon="filter_list" v-model="sc[0].text" label="Producto"></v-combobox>
                    </v-flex>
                    <v-flex xs12 md10>
                        <v-layout justify-center row wrap>
                            <v-flex xs12 md2 cols="12" sm="4" md="2">
                                <label>Lunes</label>
                                <v-checkbox style="5px 7px 0px !important" v-model="sc[0].lunes"></v-checkbox>
                            </v-flex>
                            <v-flex xs12 md2 cols="12" sm="4" md="2">
                                <label>Martes</label>
                                <v-checkbox  v-model="sc[0].martes"></v-checkbox>
                            </v-flex>
                            <v-flex xs12 md2 cols="12" sm="4" md="2">
                                <label>Miercoles</label>
                                <v-checkbox  v-model="sc[0].miercoles"></v-checkbox>
                            </v-flex>
                            <v-flex xs12 md2 cols="12" sm="4" md="2">
                                <label>Jueves</label>
                                <v-checkbox  v-model="sc[0].jueves"></v-checkbox>
                            </v-flex>
                            <v-flex xs12 md2 cols="12" sm="4" md="2">
                                <label>Viernes</label>
                                <v-checkbox  v-model="sc[0].viernes"></v-checkbox>
                            </v-flex>
                            <v-flex xs12 md2 cols="12" sm="4" md="2">
                                <label>Sabados</label>
                                <v-checkbox  v-model="sc[0].sabado"></v-checkbox>
                            </v-flex>
                            <v-flex xs12 md2 cols="12" sm="4" md="2">
                                <label>Domingos</label>
                                <v-checkbox  v-model="sc[0].domingo"></v-checkbox>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12 md1>
                    </v-flex>
                </v-layout>
                <v-layout justify-center row wrap>
                    <v-flex xs12 md12>
                        <label class="subTitle">Caracteristicas</label><v-icon medium @click="attrs ? attrs = false : attrs = true">add</v-icon>
                        <div v-if="attrs">
                            <v-layout row wrap>
                                <div v-for="(attr, index) in sc[0].attributes" :key="index+'_'+attr.code" class="row col-md-8">
                                    <div v-if="attr.options && attr.options.length > 0">
                                        <v-combobox  :disabled="attr.custom" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" :items="formatList(attr.options, 'code', 'code')" prepend-icon="filter_list" :label="attr.code"></v-combobox>
                                    </div>
                                    <div v-else>
                                        <div v-if="attr.type == 'boolean'">
                                            <v-switch :disabled="attr.custom" :key="index+'_'+attr.code" prepend-icon="title" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" :label="attr.code"></v-switch>
                                        </div>
                                        <div v-else>
                                            <div v-if="attr.size == 'short'">
                                                <v-text-field :disabled="attr.custom" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" prepend-icon="library_books" name="title" :label="attr.code" type="text"></v-text-field>
                                            </div>
                                            <div v-else-if="attr.size == 'medium'">
                                                <v-textarea :disabled="attr.custom" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" prepend-icon="library_books" height="77px" name="mediumText" :label="attr.code"></v-textarea>
                                            </div>
                                            <div v-else>
                                                <v-textarea :disabled="attr.custom" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" prepend-icon="library_books" height="135px" name="mediumText" :label="attr.code"></v-textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </v-layout>
                        </div>
                    </v-flex>
                </v-layout>
                <v-layout row wrap>
                    <v-combobox prepend-icon="filter_list" v-model="sc[0].delivery_place" :items="formatList(customer.delivery_places, 'name', 'id', 'unit_name')" label="Lugares de entrega"></v-combobox>
                </v-layout><hr><br>
            </v-card>
        </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" style="width:100%" @click="processPreOrder()">Guardar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import {mapActions,mapState} from 'vuex';
  
  export default {
    name: 'detail-pre-order',
    props:['sc', 'customer'],
    data () {
      return {
        preOrder:{},
        info:{},
        days:[],
        attrs:false,
      }
    },
    watch:{
        sc(val){
            if(val){
                for(var r = 0; r < val[0].days.length; r++){

                    if(val[0].days[r] == 0)
                        val[0].domingo = true;

                    if(val[0].days[r]){
                        switch(val[0].days[r]){
                            case 1: val[0].lunes = true; break;
                            case 2: val[0].martes = true; break;
                            case 3: val[0].miercoles = true; break;
                            case 4: val[0].jueves = true; break;
                            case 5: val[0].viernes = true; break;
                            case 6: val[0].sabado = true; break;
                        }
                    }
                }
                this.sc = val;
            }
        },
    },
    mounted () {
    },
    methods: {
        ...mapActions({
            update: 'preOrder/update',
            setWarning: 'setWarning',
        }),
        formatList(list, name, code, secondName = ""){
            var lst = [];
            if(list){
                for(var s = 0; s < list.length; s++){
                    var text = list[s][name];
                    if(secondName!="")text+= " "+list[s][secondName];
                    lst.push({"text":text, "value":list[s][code]});
                }
            }
            return lst;
        },
        closeModal(){
            this.$emit('closeModal', false);
        },
        day(name){
            var r = "";
            switch(name){
                case "lunes": r = 1; break;
                case "martes": r = 2; break;
                case "miercoles": r = 3; break;
                case "jueves": r = 4; break;
                case "viernes": r = 5; break;
                case "sabado": r = 6; break;
                case "domingo": r = 0; break;
            }
            return r;
        },
        formatAttributes(lst){
            var list = [];
            for(var r = 0; r < lst.length; r++){
                list.push({"attribute":lst[r]._id, "value":lst[r].value && lst[r].value.value ? lst[r].value.value : lst[r].value });
            }
            return list;
        },
        buildPreOrder(){
            var days = [];
            var week = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];  
            for(var s = 0; s < week.length; s++){
                if(this.sc[0][week[s]] && this.sc[0][week[s]] == true){
                    var d = this.day(week[s]);
                    if(d != "")
                        days.push(d);
                }
            }

            var json = {};
            var item = {
                "product": this.sc[0].product_id,
                "sub_product": this.sc[0].sub_product,
                "attributes": this.formatAttributes(this.sc[0].attributes),
                "unit_value": this.sc[0].unit_value,
                "quantity": this.sc[0].quantity,
            };
            var place = this.sc[0].delivery_place && this.sc[0].delivery_place.value ? this.sc[0].delivery_place.value : this.sc[0].delivery_place;
            json = {"days":days, "item":item, "delivery_place":place, "customer":this.sc[0].customer_id, "_id":this.sc[0]._id};
            return json;
        },
        processPreOrder(){
            this.update(this.buildPreOrder()).then(
                data => {
                    this.setWarning(data, { root: true }).then(()=>{
                        this.closeModal();
                    })
                },
                error => {
            });
        },
    },
    computed:{
        ...mapState({
            warning: state => state.warning,
        }),
    },
  }
</script>

