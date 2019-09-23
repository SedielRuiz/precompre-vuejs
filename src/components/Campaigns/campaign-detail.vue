<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md10>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Detalle de camapaña</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="success" @click="redirect(true)">Editar</v-btn>
            <v-btn color="error" @click="redirect(false)">Cancelar</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form>
                <v-text-field :disabled="true" v-model="campaign.name" prepend-icon="email" name="name" label="Nombre" type="text"></v-text-field>
                <v-textarea :disabled="true" v-model="campaign.description" prepend-icon="library_books"name="description" label="Descripción"></v-textarea>
                <v-text-field :disabled="true" v-model="campaign.code_promo" prepend-icon="email" name="code" label="Código de promoción" type="text"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<style>
  .custom{
    font-size:15px;
  }
</style>
<script>
  import {mapActions,mapState} from 'vuex';
  
  export default {
    
    name: 'campaign-detail',
    data () {
      return {
        campaign: {},
        customers:[],
        edit:"",
      }
    },
    watch:{
        cmp(val){
          if(val){
            this.campaign = val;
          }
        },
    },
    mounted () {
        this.edit = this.$route.params.id == undefined ? 0 : this.$route.params.id;
        if(this.edit!=""){
            this.getCampaign(this.edit);
        }
    },
    methods: {
        ...mapActions({
            getCampaign: 'campaign/getCampaign', 
            setWarning: 'setWarning',
        }),
        redirect(page){
            if(page){
                this.$router.push('/campaignManage/'+this.edit)
            }else{
                this.$router.push('/campaignList')
            }
        }
    },
    computed:{
        ...mapState({
            warning: state => state.warning,
            cmp: state => state.campaign.campaign, 
        }),
    },
  }
</script>

