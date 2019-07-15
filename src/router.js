import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import store from './store'
//COMPONENTES
import Login from '@/components/Auth/Login';
import Principal from '@/components/Welcome';
/**Permisos**/
import PermissionList from '@/components/Permissions/permission-list';
import PermissionDetail from '@/components/Permissions/permission-detail';
/**Roles**/
import RoleList from '@/components/Roles/role-list';
import RoleManage from '@/components/Roles/role-manage';
import RoleDetail from '@/components/Roles/role-detail';
/**Usuarios**/
import UserList from '@/components/Users/user-list';
import UserManage from '@/components/Users/user-manage';
import UserDetail from '@/components/Users/user-detail';
/**Atributos de producto**/
import AtributeList from '@/components/ProductAttributes/product-attribute-list';
import AtributeManage from '@/components/ProductAttributes/product-attribute-manage';
import AtributeDetail from '@/components/ProductAttributes/product-attribute-detail';
/**Clases de producto**/
import ClassList from '@/components/ProductClass/product-class-list';
import ClassManage from '@/components/ProductClass/product-class-manage';
import ClassDetail from '@/components/ProductClass/product-class-detail';
/**Productos**/
import ProductList from '@/components/Products/product-list';
import ProductManage from '@/components/Products/product-manage';
import ProductDetail from '@/components/Products/product-detail';
/**Luegares de entrega**/
import PlaceDeliveryList from '@/components/PlacesDelivery/place-delivery-list';
import PlaceDeliveryManage from '@/components/PlacesDelivery/place-delivery-manage';
import PlaceDeliveryDetail from '@/components/PlacesDelivery/place-delivery-detail';
/**Clientes**/
import CustomerList from '@/components/Customers/customer-list';
import CustomerManage from '@/components/Customers/customer-manage';
import CustomerDetail from '@/components/Customers/customer-detail';

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
    /**Permisos**/
    {
        path: '/permissionList',
        name: 'permissionList',
        component: PermissionList,
        meta: { Auth: true, title: 'Permisos' },
    },
    {
        path: '/permissionDetail/:id',
        name: 'permissionDetail',
        component: PermissionDetail,
        meta: { Auth: true, title: 'Permiso' },
    },
    /**Roles**/
    {
        path: '/roleList',
        name: 'roleList',
        component: RoleList,
        meta: { Auth: true, title: 'Roles' },
    },
    {
        path: '/roleDetail/:id',
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
        meta: { Auth: false, title: 'Crear usuario' },
    },
    {
        path: '/userManage/:id',
        name: 'userManageUpdate',
        component: UserManage,
        meta: { Auth: true, title: 'Editar usuario' },
    },
    /**Atributos de producto**/
    {
        path: '/atributesProductList',
        name: 'atributesProductList',
        component: AtributeList,
        meta: { Auth: true, title: 'Atributos' },
    },
    {
        path: '/atributesProductDetail/:id',
        name: 'atributesProductDetail',
        component: AtributeDetail,
        meta: { Auth: true, title: 'Atributo' },
    },
    {
        path: '/atributesProductManage',
        name: 'atributesProductManageCreate',
        component: AtributeManage,
        meta: { Auth: true, title: 'Crear atributo' },
    },
    {
        path: '/atributesProductManage/:id',
        name: 'atributesProductManageUpdate',
        component: AtributeManage,
        meta: { Auth: true, title: 'Editar atributo' },
    },
    /**Clases de atributos**/
    {
        path: '/classProductList',
        name: 'classProductList',
        component: ClassList,
        meta: { Auth: true, title: 'Clases de atributos' },
    },
    {
        path: '/classProductDetail/:id',
        name: 'classProductDetail',
        component: ClassDetail,
        meta: { Auth: true, title: 'Clase' },
    },
    {
        path: '/classProductManage',
        name: 'classProductManageCreate',
        component: ClassManage,
        meta: { Auth: true, title: 'Crear clase' },
    },
    {
        path: '/classProductManage/:id',
        name: 'classProductManageUpdate',
        component: ClassManage,
        meta: { Auth: true, title: 'Editar clase' },
    },
    /**Productos**/
    {
        path: '/productList',
        name: 'productList',
        component: ProductList,
        meta: { Auth: true, title: 'Productos' },
    },
    {
        path: '/productDetail/:id',
        name: 'productDetail',
        component: ProductDetail,
        meta: { Auth: true, title: 'Producto' },
    },
    {
        path: '/productManage',
        name: 'productManageCreate',
        component: ProductManage,
        meta: { Auth: true, title: 'Crear producto' },
    },
    {
        path: '/productManage/:id',
        name: 'productManageUpdate',
        component: ProductManage,
        meta: { Auth: true, title: 'Editar producto' },
    },
    /**Lugares de entrega**/
    {
        path: '/placeDeliveryList',
        name: 'placeDeliveryList',
        component: PlaceDeliveryList,
        meta: { Auth: true, title: 'Lugares de entrega' },
    },
    {
        path: '/placeDeliveryDetail/:id',
        name: 'placeDeliveryDetail',
        component: PlaceDeliveryDetail,
        meta: { Auth: true, title: 'Lugar de entrega' },
    },
    {
        path: '/placeDeliveryManage',
        name: 'placeDeliveryManageCreate',
        component: PlaceDeliveryManage,
        meta: { Auth: true, title: 'Crear lugar de entrega' },
    },
    {
        path: '/placeDeliveryManage/:id',
        name: 'placeDeliveryManageUpdate',
        component: PlaceDeliveryManage,
        meta: { Auth: true, title: 'Editar lugar de entrega' },
    },
    /**Clientes**/
    {
        path: '/customerList',
        name: 'customerList',
        component: CustomerList,
        meta: { Auth: true, title: 'Clientes' },
    },
    {
        path: '/customerDetail/:id',
        name: 'customerDetail',
        component: CustomerDetail,
        meta: { Auth: true, title: 'Cliente' },
    },
    {
        path: '/customerManage/',
        name: 'customerManageCreate',
        component: CustomerManage,
        meta: { Auth: true, title: 'Crear cliente' },
    },
    {
        path: '/customerManage/:id/:custommer',
        name: 'customerManageUpdate',
        component: CustomerManage,
        meta: { Auth: true, title: 'Editar cliente' },
    },
  ]
})


//.configurar el router
//para cada cambio de ruta

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  if (to.meta.Auth && !store.state.auth.logged) {
    next({path: '/login'});
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