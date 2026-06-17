import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '../lib/firebase';
import HomeView from '../views/HomeView.vue';
import ProductDetailView from '../views/ProductDetailView.vue';
import CartView from '../views/CartView.vue';
import ProfileView from '../views/ProfileView.vue';
import AuthView from '../views/AuthView.vue';
import AdminView from '../views/AdminView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/product/:id',
    name: 'detail',
    component: ProductDetailView,
    props: (route: any) => ({ productId: route.params.id }),
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartView,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: AuthView,
    props: { mode: 'login' },
  },
  {
    path: '/register',
    name: 'register',
    component: AuthView,
    props: { mode: 'register' },
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard：驗證保護
router.beforeEach((to, _from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  const requiresAdmin = to.meta.requiresAdmin;
  const currentUser = auth.currentUser;

  if (requiresAuth && !currentUser) {
    // 未登入 → 導向登入頁，並記住原本要去的頁面
    next({ name: 'login', query: { redirect: to.fullPath } });
    return;
  }

  if (requiresAdmin) {
    // 管理員驗證：檢查 email domain 或 Firebase custom claim
    // 這裡用 localStorage 儲存的 adminVerified flag（由 AdminView 負責設定）
    const isAdmin = sessionStorage.getItem('adminVerified') === 'true';
    if (!isAdmin) {
      next({ name: 'home' });
      return;
    }
  }

  next();
});

export default router;
