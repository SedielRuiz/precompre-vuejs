<template>
  <v-container>
    <v-layout row wrap>
        <v-flex xs12 sm12 md2>
            <h1>Clientes</h1>
        </v-flex>
        <v-flex xs12 sm12 md10>
            <v-btn color="success" @click="redirect(false, 0)">Nuevo</v-btn>
            <v-btn color="success" @click="filt ? filt = false : filt = true">Filtrar</v-btn>
        </v-flex>
    </v-layout>
    <div v-if="filt"><br>
      <label style="font-size:20px;">Filtros</label><hr>
      <v-layout row wrap>
        <v-flex xs12 sm12 md4>
          <v-text-field v-model="filter.name" prepend-icon="person" name="name" label="Nombres" type="text"></v-text-field>
        </v-flex>
        <v-flex xs12 sm12 md4>
          <v-text-field v-model="filter.last_name" prepend-icon="person" name="last_mame" label="Apellidos" type="text"></v-text-field>
        </v-flex>
        <v-flex xs12 sm12 md4>
          <v-text-field v-model="numberPhone" prepend-icon="phone" name="phone" label="Teléfono" type="number"></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12 sm12 md3>
          <v-select v-model="filter.campaign_code" prepend-icon="account_box" :items="campaigns" label="Código de campaña"></v-select>
        </v-flex>
        <v-flex xs12 sm12 md2>
          <v-text-field v-model="verifyCode" prepend-icon="email" name="email" label="Código de verificación" type="text"></v-text-field>
        </v-flex>
        <v-flex xs12 sm12 md3>
          <v-text-field v-model="filter.email" prepend-icon="email" name="email" label="Correo" type="text"></v-text-field>
        </v-flex>
        <v-flex xs12 sm12 md2>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="searchFilter()"><v-icon medium>search</v-icon></v-btn>
        </v-flex>
      </v-layout>
    </div>
    <hr><br>
    <v-data-table
        :headers="headers"
        :items="rows"
        hide-actions
        :pagination.sync="pagination"
        class="elevation-1">
        <template v-slot:items="props">
          <td>{{ props.item.created_at.split("T")[0].split("-")[2] +"/"+ props.item.created_at.split("T")[0].split("-")[1] +"/"+ props.item.created_at.split("T")[0].split("-")[0]}} <br>{{getHour(props.item.created_at)}}</td>
          <td>{{ props.item.name }} {{ props.item.last_name }}</td>
          <td>{{ props.item.email }}</td>
          <td>{{ props.item.telephones.length > 0 ? (props.item.telephones.find(element=>{return element.main == true}) && props.item.telephones.find(element=>{return element.main == true}).number ? props.item.telephones.find(element=>{return element.main == true}).number : "") : "" }}</td>
          <td>{{ props.item.campaign_code ? props.item.campaign_code : ""}}</td>
          <td>{{ props.item.telephones.length > 0 ? (props.item.telephones.find(element=>{return element.main == true}) && props.item.telephones.find(element=>{return element.main == true}).verification_code ? props.item.telephones.find(element=>{return element.main == true}).verification_code : "") : "" }}</td>
          <td>
            <v-icon medium @click="redirect(true, props.item._id)"tooltip="Detalle">more_vert</v-icon>
            <v-icon style="color:#bf1526;" medium @click="deleteCustomer(props.item._id)">delete</v-icon>
          </td>
        </template>
    </v-data-table>
    <!--pagination @search="search" :total_pages="total_pages" :total_items="total_items" :page_size="page_size"></pagination-->
  </v-container>
</template>

<script>
  import {mapActions,mapState} from 'vuex';
  import pagination from '@/components/Pagination';
  
  export default {
    name: 'customer-list',
    components: {
      //pagination,
    },
    data () {
      return {
        headers: [
          {text:"Fecha de ingreso", value:"created_at"},
          {text:"Nombre", value:"name"},
          {text:"Correo", value:"email"},
          {text:"Teléfono", value:"telephones"},
          {text:"Campaña", value:"campaign_code"},
          {text:"Código de verificación", value:"telephones"},
          {text:"Acciones", value:"actons"}
        ],
        pagination:{
          descending:true,
          rowsPerPage:-1,
        },
        verify:false,
        verify_code:"",
        info:"",
        filt:false,
        filter:{},
        campaigns:[],
        numberPhone:"",
        verifyCode:"",
      }
    },
    watch:{
        campa(val){
            if(val){
                for(var s = 0; s < val.length; s++){
                    this.campaigns.push({ "text":val[s].code_promo, "value":val[s]._id });
                }
            }
        },
    },
    mounted () {
      this.fetchCustomers({page_size:-1});
      this.fetchCampaigns();
    },
    methods: {
      ...mapActions({
        fetchCustomers: 'customer/fetchCustomers',
        fetchFilter: 'customer/fetchFilter',
        fetchCampaigns: 'campaign/fetchCampaigns',
        delete: 'customer/delete',
        setWarning: 'setWarning',
      }),
      getHour(date){
        var dt = new Date(date);
        return dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds();
      },
      searchFilter(){
        if(this.numberPhone || this.verifyCode){
          var telephones = { number:"", verification_code:"" };
        }
        if(this.numberPhone){
          telephones.number = this.numberPhone;
        }
        if(this.verifyCode){
          telephones.verification_code = this.verifyCode;
        }
        this.fetchFilter({"filters":this.filter, "telephones":telephones});
        //this.filter = {};
      },
      deleteCustomer(id){
        if(confirm("¿ Seguro que desea eliminar este registro ? ")){
          this.delete(id).then(
            data => {
              this.setWarning(data, { root: true }).then(()=>{
                  this.fetchCustomers();
              })
            },
            error => {
              console.log(error);
            });
        }
      },
      search(pagination){
        this.fetchCustomers(pagination);
      },
      redirect(page,id){
        if(!page){
            this.$router.push('/customerManage')
        }else{
            this.$router.push('/customerDetail/'+id)
        }
      }
    },
    computed:{
      ...mapState({
        warning: state => state.warning,
        rows: state => state.customer.customers,
        page_size: state => state.customer.page_size,
        total_items: state => state.customer.total_items,
        total_pages: state => state.customer.total_pages,
        campa: state => state.campaign.campaigns,
      }),
    },
  }
</script>

