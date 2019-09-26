<template>
  <v-container>
    <div class="text-center">
        <v-pagination
            v-model="page"
            :length="total_pages"
            circle
        ></v-pagination>
        <v-layout align-center justify-center row wrap>
            <v-flex xs12 md1></v-flex>
            <v-flex xs12 md1>
                <v-text-field v-model="rows" @change="updateRegister()" name="row" label="Registros" type="number"></v-text-field>
            </v-flex>
            <v-flex xs4 md2>{{since}} - {{until}} de {{total_items}}</v-flex>
            <v-flex xs12 md1></v-flex>
        </v-layout>
    </div>
  </v-container>
</template>
<style>
  .v-datatable__actions{
    /*display:none !important;*/
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
        page_size:0,
        since:1,
        until:0
      }
    },
    mounted () {
      this.page_size = 10;
      if(this.total_items < this.page_size){
        this.until = this.total_items;
        this.rows = this.total_items;
      }else{
        this.rows = this.page_size;
        this.until = this.page_size;
      }
      if(this.total_items == undefined){
        this.total_items = 0;
        this.rows = 0;
        this.until = 0;
        this.since = 0;
      }
    },
    watch:{
        page(val){
          if(val){
            this.buildPag(val);
            this.until = val * this.page_size;
            this.since = this.until - this.page_size + 1;
          }
        },
    },
    methods: {
        updateRegister(){
            if(this.rows){
                if(this.rows > this.total_items || this.rows < 1){
                    this.rows = this.until;
                }else{
                    this.rows = Math.round(this.rows);
                    this.until = this.rows;
                    this.page_size = this.rows;
                    this.buildPag(this.page);
                }
            }
        },
        buildPag(val){
          if(val){
            this.pagination.page_number = val - 1;
            this.pagination.page_size = this.page_size; 
            this.search(this.pagination);
          }
        },
        search(pag){
          if(pag){
            this.$emit("search", pag);
          }
        }
    },
  }
</script>

