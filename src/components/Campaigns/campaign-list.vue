<template>
  <v-container>
    <div class="row col-md-10">
        <div class="col-md-8">
            <h1>Campañas</h1>
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
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.description }}</td>
        <td>{{ props.item.code_promo }}</td>
        <td>
          <v-btn color="primary" @click="redirect(true, props.item._id)">Detalle</v-btn>
          <v-btn color="error" @click="deleteCampaign(props.item._id)">Eliminar</v-btn>  
        </td>
        </template>
    </v-data-table>
    <pagination @search="search" :total_pages="total_pages" :total_items="total_items" :page_size="page_size"></pagination>
  </v-container>
</template>

<script>
  import {mapActions,mapState} from 'vuex';
  import pagination from '@/components/Pagination';
  
  export default {
    name: 'campaign-list',
    components: {
      pagination,
    },
    data () {
      return {
        headers: [
            {text:"Nombre", value:"name"},
            {text:"Descripción", value:"description"},
            {text:"Código de promoción", value:"code_promo"},
            {text:"Acciones", value:"actons"}
        ]
      }
    },
    mounted () {
      this.fetchCampaigns();
    },
    methods: {
      ...mapActions({
        fetchCampaigns: 'campaign/fetchCampaigns',
        delete: 'campaign/delete',
        setWarning: 'setWarning',
      }),
      deleteCampaign(id){
        if(confirm("¿ Seguro que desea eliminar este registro ? ")){
          this.delete(id).then(
            data => {
              this.setWarning(data, { root: true }).then(()=>{
                  this.fetchCampaigns();
              })
            },
            error => {
              console.log(error);
            });
        }
      },
      search(pagination){
        this.fetchCampaign(pagination);
      },
      redirect(page,id){
        if(!page){
            this.$router.push('/campaignManage')
        }else{
            this.$router.push('/campaignDetail/'+id)
        }
      }
    },
    computed:{
      ...mapState({
        warning: state => state.warning,
        rows: state => state.campaign.campaigns,
        page_size: state => state.campaign.page_size,
        total_items: state => state.campaign.total_items,
        total_pages: state => state.campaign.total_pages,
      }),
    },
  }
</script>

