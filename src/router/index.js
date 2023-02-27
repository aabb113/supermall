import Vue from "vue";
import VueRouter from "vue-router";

//路由懒加载
const Home = () => import('../views/home/Home')
const Category = () => import('../views/category/Category')
const Cart = () => import('../views/cart/Cart')
const Profile = () => import('../views/profile/Profile')
const Detail=()=>import('../views/detail/Detail.vue')

//1.安装插件
Vue.use(VueRouter);

//2.创建路由对象

const routes=[
    {
        path: '',
        redirect: '/home'
      },
      {
        path: '/home',
        component: Home
      },
      {
        path: '/category',
        component: Category
      },
      {
        path: '/cart',
        component: Cart
      },
      {
        path: '/profile',
        component: Profile
      },
      {
        path: '/detail/:iid',     //实现动态路由并传递参数
        component: Detail
      },
]
const router=new VueRouter({
    routes,
    mode:'history',
})

//3.导出router
export default router