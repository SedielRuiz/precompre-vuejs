import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import store from './store'
//COMPONENTES
import Login from '@/components/Auth/Login';
import Principal from '@/components/Welcome';
/**Roles**/
import RoleList from '@/components/Roles/role-list';
import RoleManage from '@/components/Roles/role-manage';
import RoleDetail from '@/components/Roles/role-detail';
/**Usuarios**/
import UserList from '@/components/Users/user-list';
import UserManage from '@/components/Users/user-manage';
import UserDetail from '@/components/Users/user-detail';

const router = new Router({
  routes: [
    {
        path: '/',
        name: 'home',
        component: Principal,
        meta: { Auth: true, title: 'Inicio', view: 'menu'},
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: { Auth: false, title: 'Iniciar sesión' },
        beforeEnter: (to, from, next) => {
            if(store.state.auth.logged) {
                next({ path: '/' });
            } else {
                next();
            }
        }
    },
    /**Roles**/
    {
        path: '/roleList',
        name: 'roleList',
        component: RoleList,
        meta: { Auth: true, title: 'Roles' },
    },
    {
        path: '/roleDetail',
        name: 'roleDetail',
        component: RoleDetail,
        meta: { Auth: true, title: 'Rol' },
    },
    {
        path: '/roleManage',
        name: 'roleManageCreate',
        component: RoleManage,
        meta: { Auth: true, title: 'Crear rol' },
    },
    {
        path: '/roleManage/:id',
        name: 'roleManageUpdate',
        component: RoleManage,
        meta: { Auth: true, title: 'Editar rol' },
    },
    /**Usuarios**/
    {
        path: '/userList',
        name: 'userList',
        component: UserList,
        meta: { Auth: true, title: 'Usuarios' },
    },
    {
        path: '/userDetail/:id',
        name: 'userDetail',
        component: UserDetail,
        meta: { Auth: true, title: 'Usuario' },
    },
    {
        path: '/userManage',
        name: 'userManageCreate',
        component: UserManage,
        meta: { Auth: true, title: 'Crear usuario' },
    },
    {
        path: '/userManage/:id',
        name: 'userManageUpdate',
        component: UserManage,
        meta: { Auth: true, title: 'Editar usuario' },
    },
  ]
})


//.configurar el router
//para cada cambio de ruta

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  if (!store.state.auth.logged) {
    next(/*{path: '/login'}*/);
  }else {
    if (store.state.auth.logged) {
      store.commit('auth/setUser');
    }else{
      next();
    }
    next();
    
  }
});

//.para cada cambio de ruta


export default router;