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
            <!--v-list-tile @click="dirigir('/campaignList')">
                <v-list-tile-action>
                <v-icon>assignment</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                <v-list-tile-title>Campañas</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile-->
            <v-divider></v-divider>
            <v-list-tile @click="dirigir('/placeDeliveryList')">
                <v-list-tile-action>
                <v-icon>assignment</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                <v-list-tile-title>Lugares de entrega</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile @click="dirigir('/categoryList')">
                <v-list-tile-action>
                <v-icon>assignment</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                <v-list-tile-title>Categorias</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-group prepend-icon="assignment" value="true">
              <template v-slot:activator>
                <v-list-tile @click="dirigir('/userList')">
                  <v-list-tile-title>Usuarios</v-list-tile-title>
                </v-list-tile>
              </template>

              <v-list-tile @click="dirigir('/permissionList')">
                  <v-list-tile-action>
                  <v-icon>assignment</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                  <v-list-tile-title>Permisos</v-list-tile-title>
                  </v-list-tile-content>
              </v-list-tile>

              <v-list-tile @click="dirigir('/roleList')">
                  <v-list-tile-action>
                  <v-icon>assignment</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                  <v-list-tile-title>Roles</v-list-tile-title>
                  </v-list-tile-content>
              </v-list-tile>
            </v-list-group>

            <v-divider></v-divider>

            <v-list-group prepend-icon="assignment" value="true">
              <template v-slot:activator>
                <v-list-tile @click="dirigir('/productList')">
                  <v-list-tile-title>Productos</v-list-tile-title>
                </v-list-tile>
              </template>

              <v-list-tile @click="dirigir('/atributesProductList')">
                  <v-list-tile-action>
                  <v-icon>assignment</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                  <v-list-tile-title>Atributos de producto</v-list-tile-title>
                  </v-list-tile-content>
              </v-list-tile>
              <v-list-tile @click="dirigir('/classProductList')">
                  <v-list-tile-action>
                  <v-icon>assignment</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                  <v-list-tile-title>Clases de productos</v-list-tile-title>
                  </v-list-tile-content>
              </v-list-tile>
                <v-list-tile @click="dirigir('/productListList')">
                    <v-list-tile-action>
                    <v-icon>assignment</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                    <v-list-tile-title>Filtros de productos</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
              </v-list-group>

            </v-list-group>
            <v-divider></v-divider>
            <v-divider></v-divider>
            <v-list-group prepend-icon="assignment" value="true">
              <template v-slot:activator>
                <v-list-tile @click="dirigir('/customerList')">
                  <v-list-tile-title>Clientes</v-list-tile-title>
                </v-list-tile>
              </template>
              <v-list-tile @click="dirigir('/groupList')">
                  <v-list-tile-action>
                  <v-icon>assignment</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                  <v-list-tile-title>Grupo</v-list-tile-title>
                  </v-list-tile-content>
              </v-list-tile>
              <v-list-tile @click="dirigir('/customerListList')">
                  <v-list-tile-action>
                  <v-icon>assignment</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                  <v-list-tile-title>Filtros de clientes</v-list-tile-title>
                  </v-list-tile-content>
              </v-list-tile>
            </v-list-group>

            <v-divider></v-divider>
            <v-list-group prepend-icon="assignment" value="true">
              <template v-slot:activator>
                <v-list-tile>
                  <v-list-tile-title>Compras</v-list-tile-title>
                </v-list-tile>
              </template>

              <v-list-tile @click="dirigir('/inputList')">
                <v-list-tile-action>
                <v-icon>assignment</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                <v-list-tile-title>Insumos</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list-group> 
            <v-divider></v-divider>
              <v-list-tile @click="dirigir('/comanda')">
                <v-list-tile-action>
                <v-icon>assignment</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                <v-list-tile-title>Comanda</v-list-tile-title>
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
      <span class="white--text">&copy; v0.0.10</span>
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