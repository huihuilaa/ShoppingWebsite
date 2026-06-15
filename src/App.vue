<script setup lang="ts">
import { ref } from 'vue';
import { useShopStore } from './store/shop';
import HomeView from './views/HomeView.vue';
import DetailView from './views/ProductDetailView.vue';
import CartView from './views/CartView.vue';
import ProfileView from './views/ProfileView.vue';
import AuthView from './views/AuthView.vue';

const store = useShopStore();
const currentView = ref('home');
const selectedProductId = ref<string | null>(null);

const handleNavigate = (view: string, id?: string) => {
  if (view === 'profile' && !store.isLoggedIn) {
    currentView.value = 'login';
    return;
  }
  
  currentView.value = view;
  if (id) {
    selectedProductId.value = id;
  }
};
</script>

<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-left" @click="handleNavigate('home')">
        <img src="/images/logo.png" class="nav-logo">
      </div>
      
      <div class="nav-search-wrapper" v-if="currentView === 'home'">
        <input type="text" placeholder="搜尋商品..." class="nav-search-input">
      </div>

      <div class="nav-right">
        <a class="nav-link" @click.prevent="handleNavigate('home')">商品</a>
        <a class="nav-link" @click.prevent="handleNavigate('profile')">會員中心</a>
        <a class="nav-link" @click.prevent="handleNavigate('cart')">購物車</a>
      </div>
    </div>
  </nav>

  <main class="main-content">
    <HomeView v-if="currentView === 'home'" @navigate="handleNavigate" />
    <ProductDetailView v-if="currentView === 'detail'" :id="selectedProductId" @navigate="handleNavigate" />
    <CartView v-if="currentView === 'cart'" @navigate="handleNavigate" />
    <ProfileView v-if="currentView === 'profile'" @navigate="handleNavigate" />
    
    <AuthView v-if="currentView === 'login'" mode="login" @login-success="store.isLoggedIn = true; handleNavigate('profile')" />
    <AuthView v-if="currentView === 'register'" mode="register" @login-success="store.isLoggedIn = true; handleNavigate('profile')" />
  </main>

  <footer class="footer">
    © 2026 Hui. All rights reserved.
  </footer>
</template>