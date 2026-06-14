<script setup lang="ts">
import { ref } from 'vue';
import { useShopStore } from './store/shop';
import HomeView from './views/HomeView.vue';
import ProductDetailView from './views/ProductDetailView.vue';
import CartView from './views/CartView.vue';
import ProfileView from './views/ProfileView.vue';

const store = useShopStore();
const currentView = ref('home');
const selectedProductId = ref('');

const navigate = (view: string, id: string = '') => {
  currentView.value = view;
  if (id) selectedProductId.value = id;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
  <header class="navbar">
    <div class="nav-container">
      <div class="logo" @click="navigate('home')"><span class="logo-text">田中工務店</span></div>
      <div class="search-bar"><input type="text" placeholder="搜尋商品..."></div>
      <nav class="nav-links">
        <a href="#" @click.prevent="navigate('home')">商品</a>
        <a href="#" @click.prevent="navigate('profile')">會員中心</a>
        <a href="#" class="cart-icon-btn" @click.prevent="navigate('cart')">
          🛒 <span v-if="store.totalCartQuantity > 0" class="cart-badge">{{ store.totalCartQuantity }}</span>
        </a>
      </nav>
    </div>
  </header>

  <main>
    <HomeView v-if="currentView === 'home'" @navigate="navigate" />
    <ProductDetailView v-else-if="currentView === 'detail'" :productId="selectedProductId" @navigate="navigate" />
    <CartView v-else-if="currentView === 'cart'" @navigate="navigate" />
    <ProfileView v-else-if="currentView === 'profile'" />
  </main>

  <footer class="footer"><p>© 2026 Hui. All rights reserved.</p></footer>
</template>

<style>
.cart-icon-btn { position: relative; font-size: 1.1rem; text-decoration: none; }
.cart-badge {
  position: absolute; top: -8px; right: -10px;
  background: var(--accent-color); color: white;
  font-size: 0.7rem; font-weight: bold; padding: 2px 6px;
  border-radius: 10px; line-height: 1;
}
</style>