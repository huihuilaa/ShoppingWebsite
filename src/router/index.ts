import { createRouter, createWebHistory } from 'vue-router';
import type { RouteLocationNormalized } from 'vue-router';
import { auth } from '../lib/firebase';

const waitForAuth = (): Promise<any> => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

const routes = [
  { 
    path: '/', 
    name: 'home', 
    component: () => import('../views/HomeView.vue') 
  },
  { 
    path: '/product/:id', 
    name: 'detail',
    component: () => import('../views/ProductDetailView.vue'),
    props: (route: RouteLocationNormalized) => ({ productId: route.params.id }) 
  },
  { 
    path: '/cart', 
    name: 'cart',
    component: () => import('../views/CartView.vue'),
    meta: { requiresAuth: true } 
  },
  { 
    path: '/profile', 
    name: 'profile',
    component: () => import('../views/ProfileView.vue'),
    meta: { requiresAuth: true } 
  },
  { 
    path: '/login', 
    name: 'login',
    component: () => import('../views/AuthView.vue') 
  },
  { 
    path: '/register', 
    name: 'register',
    component: () => import('../views/AuthView.vue') 
  },
  { 
    path: '/admin', 
    name: 'admin',
    component: () => import('../views/AdminView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true } 
  },
  { 
    path: '/:pathMatch(.*)*', 
    redirect: '/' 
  },
  {
  path: '/order-success',
  name: 'order-success',
  component: () => import('../views/OrderSuccessView.vue'),
  meta: { requiresAuth: true }
  },
  { 
  path: '/404', 
  name: 'not-found', 
  component: () => import('../views/NotFoundView.vue') 
  },
  { 
    path: '/:pathMatch(.*)*', 
    redirect: '/404' 
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

router.beforeEach(async (to) => {
  const currentUser = await waitForAuth();

  if (to.name === 'detail' && !to.params.id) {
    return { name: 'not-found' };
  }

  if (to.meta.requiresAuth && !currentUser) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }

  if (to.meta.requiresAdmin) {
    const isAdmin = sessionStorage.getItem('adminVerified') === 'true';
    if (!isAdmin) return { name: 'home' };
  }

  if ((to.name === 'login' || to.name === 'register') && currentUser) {
    return { name: 'profile' };
  }
});

export default router;