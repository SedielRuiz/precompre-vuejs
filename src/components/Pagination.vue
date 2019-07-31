<template>
  <v-container>
    <div class="text-center">
        <v-pagination
            v-model="page"
            :length="total_pages"
            circle
        ></v-pagination>
        <v-layout align-center justify-center row wra>
            <v-flex xs12 md1></v-flex>
            <v-flex xs12 md1>
                <v-text-field v-model="rows" name="row" label="Registros" type="number"></v-text-field>
            </v-flex>
            <v-flex xs4 md2>{{since}} - {{until}} de {{total_items}}</v-flex>
            <v-flex xs12 md1></v-flex>
        </v-layout>
    </div>
  </v-container>
</template>
<style>
  .v-datatable__actions{
    display:none !important;
  }
  .text-center{
    text-align:center !important;
  }
</style>
<script>
  export default {
    name: 'pagination',
    props:['total_pages', 'total_items'],
    data () {
      return {
        page:1,
        rows:"",
        pagination:{"page_number":0, "page_size":10},
        page_size:"",
        since:1,
        until:""
      }
    },
    mounted () {
      this.page_size = 10;
      this.rows = this.page_size;
      this.until = this.page_size;
    },
    watch:{
        rows(val){
            this.page_size = val;
            this.buildPag(this.page);
        },
        page(val){
            this.buildPag(val);
            this.until = val * this.page_size;
            this.since = this.until - this.page_size + 1;
        },
    },
    methods: {
        buildPag(val){
            this.pagination.page_number = val - 1;
            this.pagination.page_size = this.page_size; 
            this.search(this.pagination);
        },
        search(pag){
            this.$emit("search", pag);
        }
    },
  }
</script>

