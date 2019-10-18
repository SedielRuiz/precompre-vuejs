<template>
  <v-card class="elevation-12">
    <v-toolbar dark color="primary">
      <v-toolbar-title >Pre compra</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-icon medium @click="closeModal()">close</v-icon>
    </v-toolbar>
    <v-card-text>
        <v-form>
            <v-card class="pa-2" outlined tile v-if="info.length > 0">
                <v-container>
                    <h2>{{info[0].text}}</h2><hr><br>
                    <v-text-field v-model="info[0].quantity" name="quantity" label="Cantidad" type="number"></v-text-field><br>
                    
                    <div v-for="(attr, index) in info[0].attributes" :key="index+'_'+attr.code"
                        v-if="attr.hasOwnProperty('custom') && !attr.custom || (attr.custom && attr.variable)">
                        <div v-if="attr.code != 'photo'">
                            <div v-if="attr.options && attr.options.length > 0">
                                <v-flex xs12 md12>
                                    <v-combobox  :disabled="attr.custom" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" :items="formatList(attr.options, 'code', '', '', '', 'code')" :label="attr.code"></v-combobox>
                                </v-flex>
                            </div>
                            <div v-else>
                                <div v-if="attr.type == 'boolean'">
                                    <v-switch :disabled="attr.custom" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" :label="attr.code"></v-switch>
                                </div>
                                <div v-else>
                                    <div v-if="attr.size == 'short'">
                                        <v-text-field :disabled="attr.custom" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" name="title" :label="attr.code" type="text"></v-text-field>
                                    </div>
                                    <div v-else-if="attr.size == 'medium'">
                                        <v-textarea :disabled="attr.custom" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" height="77px" name="mediumText" :label="attr.code"></v-textarea>
                                    </div>
                                    <div v-else>
                                        <v-textarea :disabled="attr.custom" :key="index+'_'+attr.code" v-model="!attr.value && attr.value != ''? attr.value = attr.default_value : attr.value" height="135px" name="mediumText" :label="attr.code"></v-textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <v-layout row wrap>
                        <v-flex xs12 md12>
                            <v-layout justify-center row wrap>
                                <v-flex>
                                    <label class="title">L</label>
                                    <v-checkbox color="primary" v-model="info[0].lunes"></v-checkbox>
                                </v-flex>
                                <v-flex>
                                    <label class="title">M</label>
                                    <v-checkbox color="primary" v-model="info[0].martes"></v-checkbox>
                                </v-flex>
                                <v-flex>
                                    <label class="title">X</label>
                                    <v-checkbox color="primary" v-model="info[0].miercoles"></v-checkbox>
                                </v-flex>
                                <v-flex>
                                    <label class="title">J</label>
                                    <v-checkbox color="primary" v-model="info[0].jueves"></v-checkbox>
                                </v-flex>
                                <v-flex>
                                    <label class="title">V</label>
                                    <v-checkbox color="primary" v-model="info[0].viernes"></v-checkbox>
                                </v-flex>
                                <v-flex>
                                    <label class="title">S</label>
                                    <v-checkbox color="primary" v-model="info[0].sabado"></v-checkbox>
                                </v-flex>
                                <v-flex>
                                    <label class="title">D</label>
                                    <v-checkbox color="primary" v-model="info[0].domingo"></v-checkbox>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <!--v-combobox autocomplete="off" v-model="info[0].delivery_place" :items="formatList(customer.delivery_places, 'place_name', 'cluster_title', 'unit_u', 'id', '_id')" label="Lugares de entrega"></v-combobox-->
                    </v-layout><br>
                </v-container>
            </v-card>
        </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn dark color="primary" style="width:100%" @click="processPreOrder()">Guardar</v-btn>
    </v-card-actions>
  </v-card>
</template>
<style>
    .title{
        margin-left:15px;
    }
</style>
<script>
  import {mapActions,mapState} from 'vuex';
  
  export default {
    name: 'detail-pre-order',
    props:['sc', 'customer'],
    data () {
      return {
        preOrder:{},
        info:[],
        days:[],
        attrs:false,
      }
    },
    watch:{
        sc(val){
            if(val){
                this.info = [];
                var days = this.sc[0].days ? this.sc[0].days : this.sc[0].pre_orders[0].days;
                for(var r = 0; r < days.length; r++){

                    if(days[r] == 0)
                        val[0].domingo = true;

                    if(days[r]){
                        switch(days[r]){
                            case 1: val[0].lunes = true; break;
                            case 2: val[0].martes = true; break;
                            case 3: val[0].miercoles = true; break;
                            case 4: val[0].jueves = true; break;
                            case 5: val[0].viernes = true; break;
                            case 6: val[0].sabado = true; break;
                        }
                    }
                }
                this.info.push(val[0]);
                //this.sc.push();
                console.log(this.info);
            }
        }
    },
    mounted () {
        if(this.sc){
            var days = this.sc[0].days ? this.sc[0].days : this.sc[0].pre_orders[0].days;
            for(var r = 0; r < days.length; r++){
                if(days[r] == 0)
                    this.sc[0].domingo = true;

                if(days[r]){
                    switch(days[r]){
                        case 1: this.sc[0].lunes = true; break;
                        case 2: this.sc[0].martes = true; break;
                        case 3: this.sc[0].miercoles = true; break;
                        case 4: this.sc[0].jueves = true; break;
                        case 5: this.sc[0].viernes = true; break;
                        case 6: this.sc[0].sabado = true; break;
                    }
                }
            }
            this.info = this.sc;
        }
    },
    methods: {
        ...mapActions({
            update: 'preOrder/update',
            setWarning: 'setWarning',
        }),
        formatList(list, name, cluster, secondName, code, code2){
            var lst = [];
            if(list){
                for(var s = 0; s < list.length; s++){
                    var text = list[s][name];
                    if(cluster && (list[s][name] != list[s][cluster]))text+= " "+list[s][cluster];
                    if(secondName!="")text+= " "+list[s][secondName];
                    lst.push({"text":text, "value":list[s][code2], "id":list[s][code]});
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
                if(this.info[0][week[s]] && this.info[0][week[s]] == true){
                    var d = this.day(week[s]);
                    days.push(d);
                }
            }

            var json = [];
            var item = {
                "product": this.info[0].product_id,
                "sub_product": this.info[0].sub_product,
                "attributes": this.formatAttributes(this.info[0].attributes),
                "unit_value": this.info[0].unit_value,
                "quantity": this.info[0].quantity,
            };
            var place = this.info[0].delivery_place && this.info[0].delivery_place.value ? this.info[0].delivery_place.value : this.info[0].delivery_place;
            json.push({"days":days, "item":item, "_id":this.info[0]._id});
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

