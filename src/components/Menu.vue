<template>
  <v-app id="inspire">
  <!--v-if="access"-->
    <div v-if="access">
      <v-navigation-drawer
        v-model="drawer"
        fixed
        app>
        <v-list dense>
            <v-list-tile @click="dirigir('/')">
                <v-list-tile-action>
                <v-icon>home</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                <v-list-tile-title>Inicio</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>

            <v-divider></v-divider>

            <v-list-tile @click="dirigir('/roleList')">
                <v-list-tile-action>
                <v-icon>assignment</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                <v-list-tile-title>Roles</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>

            <v-list-tile @click="dirigir('/userList')">
                <v-list-tile-action>
                <v-icon>assignment</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                <v-list-tile-title>Usuarios</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>

            <v-divider></v-divider>
            <v-list-tile @click.prevent="processLogout()">
                <v-list-tile-action>
                <v-icon>logout</v-icon>
                </v-list-tile-action>
                <v-list-tile-content >
                <v-list-tile-title >Salir</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
      </v-navigation-drawer>
    </div>


    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Bienvenido {{fullName}}</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <router-view></router-view>
    </v-content>
    <v-footer color="indigo" app>
      <span class="white--text">&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>

  import {mapState, mapGetters, mapActions} from 'vuex';

  export default {
    data: () => ({
      drawer: null,
      fullName:""
    }),
    props: {
    },
    watch:{
      user (user){
        this.fullName = user.name + " " + user.last_name
      }
    },
    methods:{
      ...mapActions({
        logout: 'auth/logout',
      }),
      dirigir(value){
        this.$router.push(value)
      },
      processLogout () {
        this.fullName = "";
        this.logout().then(
          this.$router.push('/login')
        )
      }

    },
    computed: {
      ...mapState({
        access: state => state.auth.logged,
        user: state => state.auth.user
      })
    }
  }
</script>