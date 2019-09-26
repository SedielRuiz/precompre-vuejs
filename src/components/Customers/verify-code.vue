<template>
  <v-container >
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md10>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Verificación de código</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="redirect()">Cancelar</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <label style="font-size:20px;">Verificar código de teléfono</label><v-icon medium @click="verify ? verify = false : verify = true">keyboard_arrow_down</v-icon><hr>
              <div v-if="verify">
                  <v-layout row wrap>
                    <v-flex sm12 xs12 md8>
                      <v-text-field v-model="verify_code" prepend-icon="email" name="title" label="Código" type="text"></v-text-field><br>
                    </v-flex>
                    <v-flex sm12 xs12 md4>
                      <v-btn color="primary" :disabled="verify_code ? false : true" @click="findVerifyCode()">Consultar</v-btn><br>
                    </v-flex>
                  </v-layout>
                  <v-card style="overflow: auto;max-width: 100%;" v-if="info">
                      <v-container><hr>
                          <v-layout row wrap v-for="(c, index) in info" align-center :key="index">
                              <v-flex xs12 sm12 md3>
                                  <div v-if="c.telephones[0].verified">
                                  <i class="material-icons">check_circle_outline</i>
                                  </div>
                                  <div v-else>
                                  <v-checkbox align-center value @click="verifyNumberCode(c)"></v-checkbox>
                                  <!--v-btn color="success" @click="verifyNumberCode(c)">Validar</v-btn-->
                                  </div>
                              </v-flex>
                              <v-flex xs12 sm12 md5>
                                  {{c.name}} {{c.last_name}}
                              </v-flex>
                              <v-flex xs12 sm12 md3>
                                  {{c.telephones[0].number}}
                              </v-flex>
                              <v-flex xs12 sm12 md3>
                                  {{c.email}}
                              </v-flex>
                          </v-layout>
                      </v-container>
                  </v-card>
              </div><br>
              <label style="font-size:20px;">Buscar por teléfono</label><v-icon medium @click="send ? send = false : send = true">keyboard_arrow_down</v-icon><hr>
              <div v-if="send">
                  <v-layout row wrap>
                    <v-flex sm12 xs12 md8>
                      <v-text-field v-model="phone" prepend-icon="phone" name="title" label="Teléfono" type="number"></v-text-field><br>
                    </v-flex>
                    <v-flex sm12 xs12 md4>
                      <v-btn color="primary" :disabled="verify_code ? false : true" @click="findVerifyCode()">Consultar</v-btn><br>
                    </v-flex>
                  </v-layout>
              </div>
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

<script>
  import {mapActions,mapState} from 'vuex';
  
  export default {
    
    name: 'fast-register',
    data () {
      return {
        verify:true,
        send:false,
        verify_code:"",
        info:"",
        phone:"",
      }
    },
    mounted () {
    },
    methods: {
        ...mapActions({
            verifyCode: 'customer/verifyCode',
            findCode: 'customer/findCode',
            setWarning: 'setWarning',
        }),
        verifyNumberCode(data){
            this.verifyCode(data).then(
            data => {
                this.info = "";
                this.verify_code = "";
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
        redirect(){
            this.$router.push('/')
        }
    },
    computed:{
      ...mapState({
        warning: state => state.warning,
      }),
    },
  }
</script>

