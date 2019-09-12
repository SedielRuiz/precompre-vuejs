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
                <v-text-field v-model="campaign.name" prepend-icon="email" name="name" label="Nombre" type="text"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" :disabled="trySend" style="width: 100%;" @click="processCampaign()">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import {mapActions,mapState} from 'vuex';
  
  export default {
    
    name: 'campaign-manage',
    data () {
      return {
        campaign: {},
        edit:"",
        titleText:""
      }
    },
    watch:{
        grp(val){
          if(val){
            this.campaign = val;
            this.campaign._type = this.types.find(element=>{return element.value == val._type });
            this.customers = val.community;
            if(this.edit){
                for(var s = 0; s < this.customersId.length; s++){
                    for(var r = 0; r < this.rows.length; r++){
                        if(this.customersId[s] == this.rows[r]._id){
                            this.customers.push(this.rows[s]);
                        }
                    }
                }
            }
          }
        },
    },
    mounted () {
        this.edit = this.$route.params.id == undefined ? 0 : this.$route.params.id;
        if(this.edit!=""){
            this.titleText="Editar campaña";
            this.getCampaign(this.edit);
        }else{
          this.titleText="Nueva campaña";
        }
    },
    methods: {
        ...mapActions({
            create: 'campaign/create',
            update: 'campaign/update',
            getCampaign: 'campaign/getCampaign', 
            setWarning: 'setWarning',
        }),
        buildCampaign(){
            return this.campaign;
        },
        processCampaign () {
            this.campaign = this.buildCampaign();
            if(this.edit){
                this.update(this.campaign).then(
                    data => {
                        this.setWarning(data, { root: true }).then(()=>{
                            this.$router.push('/campaignDetail/'+this.edit)
                        })
                    },
                    error => {
                })
            }else{
                this.create(this.campaign).then(
                    data => {
                        this.setWarning(data, { root: true }).then(()=>{
                            this.$router.push('/campaignList')
                        })
                    },
                    error => {
                })
            }
        },
        redirect(page){
            if(page){
                this.$router.push('/campaignDetail/'+this.edit)
            }else{
                this.$router.push('/campaignList')
            }
        }
    },
    computed:{
        ...mapState({
            warning: state => state.warning,
            grp: state => state.campaign.campaign, 
        }),
        trySend(){
            if(this.campaign && this.campaign.name){
                return false; 
            }
            return true;
        }
    },
  }
</script>

