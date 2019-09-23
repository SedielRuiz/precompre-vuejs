<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Inicio sesion</v-toolbar-title>
            <v-spacer></v-spacer>
            <!--v-btn color="success" @click="redirect()">Registrar</v-btn-->
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field v-model="user.email" prepend-icon="email" name="login" label="Correo" type="text"></v-text-field>
              <v-text-field v-model="user.password" prepend-icon="lock" name="login" label="Contraseña" type="password"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="processLogin">Entrar</v-btn>
            <GoogleLogin :params="params" :renderParams = "renderParams " :onSuccess="onSuccess">google</GoogleLogin>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import {mapActions,mapMutations} from 'vuex';
  import GoogleLogin from 'vue-google-login';

  export default {
    
    name: 'login',
    components:{
        GoogleLogin
    },
    data () {
      return {
        user: {},
        params: {
            client_id:"139558819309-7tnj8cehputg7q9120v6f5agjvuman24.apps.googleusercontent.com"
        },
        renderParams: {
            width: 250,
            height: 50,
            longtitle: true
        },
      }
    },
    methods: {
        ...mapActions({
            login: 'auth/login',
            loginGoogle: 'auth/loginGoogle',
        }),
        ...mapMutations({

        }),
        processLogin () {
            this.login(this.user).then(
                user => {
                    this.$router.push('/');
                },
                error => {
            })
        },
        onFailure(){
            console.log("paila");
        },
        onSuccess(googleUser) {
            this.loginGoogle({"token":googleUser.Zi.id_token}).then(
                user => {
                    this.$router.push('/');
                },
                error => {
            })
        },
        redirect(){
            this.$router.push('/userManage');
        }
    }
  }
</script>
