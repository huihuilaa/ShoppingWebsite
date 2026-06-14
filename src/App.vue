<script setup lang="ts">
import { ref } from 'vue';
import HomeView from './views/HomeView.vue';
import ProductDetailView from './views/ProductDetailView.vue';
import CartView from './views/CartView.vue';
import ProfileView from './views/ProfileView.vue';

const currentView = ref('home');
const selectedProductId = ref('');

const navigate = (view: string, id: string = '') => {
  currentView.value = view;
  if (id) selectedProductId.value = id;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-left" @click="navigate('home')">
        <img src="/images/logo.png" alt="Logo" class="nav-logo">
      </div>
      
      <div class="nav-center">
        <input 
          v-if="currentView === 'home' || currentView === 'detail'" 
          type="text" 
          class="nav-search-input"
        >
      </div>
      
      <div class="nav-right">
        <a href="#" class="nav-link" @click.prevent="navigate('home')">商品</a>
        <a href="#" class="nav-link user-link" @click.prevent="navigate('profile')">
          <svg class="icon-user" viewBox="0 0 24 24" width="18" height="18">
            <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
          </svg>
          會員中心
        </a>
        <button class="nav-cart-btn" @click="navigate('cart')">
          <svg class="icon-cart" viewBox="0 0 24 24" width="20" height="20">
            <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M9 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-16-18h3l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        </button>
      </div>
    </div>
  </nav>

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