<template>
  <v-container>
    <v-layout row wra>
        <v-flex xs12 sm12 md2>
            <h1>Clientes</h1>
        </v-flex>
        <v-flex xs12 sm12 md10>
            <v-btn color="success" @click="redirect(false, 0)">Nuevo</v-btn>
            <v-btn color="success" @click="verify = true">Verificar código</v-btn>
            <v-btn color="success" @click="filt ? filt = false : filt = true">Filtrar</v-btn>
        </v-flex>
    </v-layout>
    <div v-if="filt"><br>
      <label style="font-size:20px;">Filtros</label><hr>
      <v-layout row wra>
        <v-flex xs12 sm12 md4>
          <v-text-field v-model="filter.name" prepend-icon="person" name="name" label="Nombres" type="text"></v-text-field>
        </v-flex>
        <v-flex xs12 sm12 md4>
          <v-text-field v-model="filter.last_name" prepend-icon="person" name="last_mame" label="Apellidos" type="text"></v-text-field>
        </v-flex>
        <v-flex xs12 sm12 md4>
          <v-text-field v-model="filter.email" prepend-icon="email" name="email" label="Correo" type="text"></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row wra>
        <v-flex xs12 sm12 md4>
          <v-select v-model="filter.campaign" prepend-icon="account_box" :items="campaigns" label="Código de campaña"></v-select>
        </v-flex>
        <v-flex xs12 sm12 md2>
          <v-text-field v-model="filter.verify_code" prepend-icon="email" name="email" label="Código de verificación" type="text"></v-text-field>
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
        class="elevation-1">
        <template v-slot:items="props">
        <td>{{ props.item.created_at.split("T")[0].split("-")[2] +"/"+ props.item.created_at.split("T")[0].split("-")[1] +"/"+ props.item.created_at.split("T")[0].split("-")[0]}} <br>{{props.item.created_at.split("T")[1].split(".")[0]}}</td>
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
    <pagination @search="search" :total_pages="total_pages" :total_items="total_items" :page_size="page_size"></pagination>
    
    <v-dialog v-model="verify" persistent>
      <v-card class="elevation-12">
        <v-toolbar dark color="primary">
          <v-toolbar-title>Verificación</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="verify = false">Cerrar</v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-layout row wra>
              <v-text-field v-model="verify_code" prepend-icon="email" @change="" name="title" label="Código" type="text"></v-text-field><br>
            </v-layout>
            <v-btn color="primary" :disabled="verify_code ? false : true" @click="findVerifyCode()">Consultar</v-btn><br>
            <v-card style="overflow: auto;max-width: 100%;" v-if="info">
              <v-container>
                <v-layout row wra>
                  <v-flex xs12 sm12 md4>
                    <label style="font-size:18px;"></label>
                  </v-flex>
                  <v-flex xs12 sm12 md5>
                    <label style="font-size:18px;"> Nombre </label>
                  </v-flex>
                  <v-flex xs12 sm12 md3>
                    <label style="font-size:18px;"> Teléfono</label>
                  </v-flex>
                </v-layout><hr>
                <v-layout row wra v-for="(c, index) in info" :key="index">
                  <v-flex xs12 sm12 md4>
                    <div v-if="c.telephones[0].verified">
                      <i class="material-icons">check_circle_outline</i>
                    </div>
                    <div v-else>
                      <v-checkbox align-center value @click="verifyNumberCode(c)" style="margin-top: -12px;"></v-checkbox>
                      <!--v-btn color="success" @click="verifyNumberCode(c)">Validar</v-btn-->
                    </div>
                  </v-flex>
                  <v-flex xs12 sm12 md5>
                    {{c.name}} {{c.last_name}}
                  </v-flex>
                  <v-flex xs12 sm12 md3>
                    {{c.telephones[0].number}}
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import {mapActions,mapState} from 'vuex';
  import pagination from '@/components/Pagination';
  
  export default {
    name: 'customer-list',
    components: {
      pagination,
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
        verify:false,
        verify_code:"",
        info:"",
        filt:false,
        filter:{},
        campaigns:[],
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
      this.fetchCustomers();
      this.fetchCampaigns();
    },
    methods: {
      ...mapActions({
        fetchCustomers: 'customer/fetchCustomers',
        verifyCode: 'customer/verifyCode',
        findCode: 'customer/findCode',
        fetchCampaigns: 'campaign/fetchCampaigns',
        delete: 'customer/delete',
        setWarning: 'setWarning',
      }),
      searchFilter(){
        this.fetchCustomers();
      },
      verifyNumberCode(data){
        this.verifyCode(data).then(
          data => {
            this.info = "";
            this.verify_code = "";
            this.verify = false;
            this.fetchCustomers();
          },
          error => {
            console.log(error);
        });
      },
      findVerifyCode(){
        this.findCode(this.verify_code).then(
          data => {
            this.info = data.result_set;
          },
          error => {
            console.log(error);
        });
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

