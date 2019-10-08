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
/**Categorias**/
import CategoryList from '@/components/Categories/category-list';
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
import CustomerFastRegister from '@/components/Customers/fast-register';
import CustomerverifyCode from '@/components/Customers/verify-code';
/**Grupos**/
import GroupList from '@/components/Groups/group-list';
import GroupManage from '@/components/Groups/group-manage';
import GroupDetail from '@/components/Groups/group-detail';
/***LISTAS*/
/**Listas de productos**/
import ProductListList from '@/components/Lists/ProductList/product-list-list';
import ProductListManage from '@/components/Lists/ProductList/product-list-manage';
import ProductListDetail from '@/components/Lists/ProductList/product-list-detail';
/**Listas de clientes**/
import CustomerListList from '@/components/Lists/CustomerList/customer-list-list';
import CustomerListManage from '@/components/Lists/CustomerList/customer-list-manage';
import CustomerListDetail from '@/components/Lists/CustomerList/customer-list-detail';
/******FIN LISTAS*****/
/***Shopping*/
/**Pre ordenes**/
import PreOrder from '@/components/Shopping/PreOrders/pre-order-manage';
import PreOrdersList from '@/components/Shopping/PreOrders/pre-order-list';
/**Ordenes**/
import Orders from '@/components/Shopping/Orders/orders-list';
import DetailOrders from '@/components/Shopping/Orders/order-detail';
/**Facturas**/
import Bills from '@/components/Shopping/Bills/bill-list';
/**Comanda**/
import Comanda from '@/components/Comanda';
/**Insumos**/
import InputList from '@/components/Inputs/input-list';
/**Campañas**/
import CampaignList from '@/components/Campaigns/campaign-list';
import CampaignManage from '@/components/Campaigns/campaign-manage';
import CampaignDetail from '@/components/Campaigns/campaign-detail';
/**Tiendas**/
import StoreList from '@/components/Stores/store-list';
import StoreManage from '@/components/Stores/store-manage';
import StoreDetail from '@/components/Stores/store-detail';
/**Rutas**/
import RouteList from '@/components/Routes/route-list';
import RouteManage from '@/components/Routes/route-manage';
import RouteDetail from '@/components/Routes/route-detail';

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
    /**Categorias**/
    {
        path: '/categoryList',
        name: 'categoryList',
        component: CategoryList,
        meta: { Auth: true, title: 'Categorias' },
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
        path: '/customerManage/:id',
        name: 'customerManageUpdate',
        component: CustomerManage,
        meta: { Auth: true, title: 'Editar cliente' },
    },
    {
        path: '/customerFastRegister',
        name: 'customerFastRegister',
        component: CustomerFastRegister,
        meta: { Auth: true, title: 'Registro rápido' },
    },
    {
        path: '/verifyCode',
        name: 'verifyCode',
        component: CustomerverifyCode,
        meta: { Auth: true, title: 'Verificar código' },
    },
    /**Grupos**/
    {
        path: '/groupList',
        name: 'groupList',
        component: GroupList,
        meta: { Auth: true, title: 'Grupos' },
    },
    {
        path: '/groupDetail/:id',
        name: 'groupDetail',
        component: GroupDetail,
        meta: { Auth: true, title: 'Grupo' },
    },
    {
        path: '/groupManage/',
        name: 'groupManageCreate',
        component: GroupManage,
        meta: { Auth: true, title: 'Crear grupo' },
    },
    {
        path: '/groupManage/:id/',
        name: 'groupManageUpdate',
        component: GroupManage,
        meta: { Auth: true, title: 'Editar grupo' },
    },
    /**Listas de productos**/
    {
        path: '/productListList',
        name: 'productListList',
        component: ProductListList,
        meta: { Auth: true, title: 'Listas de productos' },
    },
    {
        path: '/productListDetail/:id',
        name: 'productListDetail',
        component: ProductListDetail,
        meta: { Auth: true, title: 'Lista' },
    },
    {
        path: '/productListManage/',
        name: 'productListManageCreate',
        component: ProductListManage,
        meta: { Auth: true, title: 'Crear lista' },
    },
    {
        path: '/productListManage/:id/',
        name: 'productListManageUpdate',
        component: ProductListManage,
        meta: { Auth: true, title: 'Editar lista' },
    },
    /**Listas de clientes**/
    {
        path: '/customerListList',
        name: 'customerListList',
        component: CustomerListList,
        meta: { Auth: true, title: 'Listas de productos' },
    },
    {
        path: '/customerListDetail/:id',
        name: 'customerListDetail',
        component: CustomerListDetail,
        meta: { Auth: true, title: 'Lista' },
    },
    {
        path: '/customerListManage/',
        name: 'customerListManageCreate',
        component: CustomerListManage,
        meta: { Auth: true, title: 'Crear lista' },
    },
    {
        path: '/customerListManage/:id/',
        name: 'customerListManageUpdate',
        component: CustomerListManage,
        meta: { Auth: true, title: 'Editar lista' },
    },

    /**Pre ordenes**/
    {
        path: '/preOrder/:id',
        name: 'preOrder',
        component: PreOrder,
        meta: { Auth: true, title: 'Listas de pre ordenes' },
    },
    {
        path: '/preOrder',
        name: 'preOrderG',
        component: PreOrder,
        meta: { Auth: true, title: 'Listas de pre ordenes' },
    },
    {
        path: '/preOrderList',
        name: 'preOrderList',
        component: PreOrdersList,
        meta: { Auth: true, title: 'Listas de pre ordenes' },
    },
    /**Ordenes**/
    {
        path: '/orders/:id',
        name: 'order',
        component: Orders,
        meta: { Auth: true, title: 'Lista de ordenes' },
    },
    {
        path: '/orderDetail/:id',
        name: 'orderDetail',
        component: DetailOrders,
        meta: { Auth: true, title: 'Detalle de ordenes' },
    },
    /**Facturas**/
    {
        path: '/bills/:id',
        name: 'bills',
        component: Bills,
        meta: { Auth: true, title: 'Lista de facturas' },
    },
    /**Comanda**/
    {
        path: '/comanda',
        name: 'comanda',
        component: Comanda,
        meta: { Auth: true, title: 'Comanda' },
    },
    /**Insumos**/
    {
        path: '/inputList',
        name: 'inputList',
        component: InputList,
        meta: { Auth: true, title: 'Insumos' },
    },
    /**Campañas**/
    {
        path: '/campaignList',
        name: 'campaignList',
        component: CampaignList,
        meta: { Auth: true, title: 'Campañas' },
    },
    {
        path: '/campaignDetail/:id',
        name: 'campaignDetail',
        component: CampaignDetail,
        meta: { Auth: true, title: 'Campaña' },
    },
    {
        path: '/campaignManage/',
        name: 'campaignManageCreate',
        component: CampaignManage,
        meta: { Auth: true, title: 'Crear camapaña' },
    },
    {
        path: '/campaignManage/:id/',
        name: 'campaignManageUpdate',
        component: CampaignManage,
        meta: { Auth: true, title: 'Editar camapaña' },
    },
    /**Tiendas**/
    {
        path: '/storeList',
        name: 'storeList',
        component: StoreList,
        meta: { Auth: true, title: 'Tiendas' },
    },
    {
        path: '/storeDetail/:id',
        name: 'storeDetail',
        component: StoreDetail,
        meta: { Auth: true, title: 'Tienda' },
    },
    {
        path: '/storeManage/',
        name: 'storeManageCreate',
        component: StoreManage,
        meta: { Auth: true, title: 'Crear tiendas' },
    },
    {
        path: '/storeManage/:id/',
        name: 'storeManageUpdate',
        component: StoreManage,
        meta: { Auth: true, title: 'Editar tiendas' },
    },
    /**Rutas**/
    {
        path: '/routeList',
        name: 'routeList',
        component: RouteList,
        meta: { Auth: true, title: 'Rutas' },
    },
    {
        path: '/routeDetail/:id',
        name: 'routeDetail',
        component: RouteDetail,
        meta: { Auth: true, title: 'Ruta' },
    },
    {
        path: '/routeManage/',
        name: 'routeManageCreate',
        component: RouteManage,
        meta: { Auth: true, title: 'Crear ruta' },
    },
    {
        path: '/routeManage/:id/',
        name: 'routeManageUpdate',
        component: RouteManage,
        meta: { Auth: true, title: 'Editar ruta' },
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