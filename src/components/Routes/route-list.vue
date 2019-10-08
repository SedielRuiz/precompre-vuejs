<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12 sm12 md2>
                <h1>Rutas</h1>
            </v-flex>
            <v-flex xs12 sm12 md10>
                <v-btn color="success" @click="redirect(false, 0)">Nuevo</v-btn>
                <v-btn color="success"><v-icon medium @click="search({page_size:10})"tooltip="Detalle">refresh</v-icon></v-btn>
            </v-flex>
        </v-layout>
        <hr><br>
        <v-data-table
            :headers="headers"
            :items="rows"
            hide-actions disable-initial-sort
            class="elevation-1">
            <template v-slot:items="props">
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.sector }}</td>
            <td>{{ props.item.schedule[0] }}</td>
            <td>
            <v-icon medium @click="redirect(true, props.item._id)"tooltip="Detalle">more_vert</v-icon>
            <v-icon style="color:#bf1526;" medium @click="deleteRoute(props.item._id)">delete</v-icon>
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
    name: 'route-list',
    components: {
      pagination,
    },
    data () {
      return {
        headers: [
            {text:"Nombre", value:"name"},
            {text:"Sector", value:"sector"},
            {text:"Horario", value:"schedule"},
            {text:"Acciones", value:"actons"}
        ]
      }
    },
    mounted () {
      this.fetchRoutes();
    },
    methods: {
      ...mapActions({
        fetchRoutes: 'route/fetchRoutes',
        delete: 'route/delete',
        setWarning: 'setWarning',
      }),
      deleteRoute(id){
        if(confirm("¿ Seguro que desea eliminar este registro ? ")){
          this.delete(id).then(
            data => {
              this.setWarning(data, { root: true }).then(()=>{
                  this.fetchRoutes();
              })
            },
            error => {
              console.log(error);
            });
        }
      },
      search(pagination){
        this.fetchRoutes(pagination);
      },
      redirect(page,id){
        if(!page){
            this.$router.push('/routeManage')
        }else{
            this.$router.push('/routeDetail/'+id)
        }
      }
    },
    computed:{
      ...mapState({
        warning: state => state.warning,
        rows: state => state.route.routes,
        page_size: state => state.route.page_size,
        total_items: state => state.route.total_items,
        total_pages: state => state.route.total_pages,
      }),
    },
  }
</script>

