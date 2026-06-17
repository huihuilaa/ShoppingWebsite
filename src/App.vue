<script setup lang="ts">
import { ref } from 'vue';
import { useShopStore } from './store/shop';
import { auth } from './lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

import HomeView from './views/HomeView.vue';
import ProductDetailView from './views/ProductDetailView.vue';
import CartView from './views/CartView.vue';
import ProfileView from './views/ProfileView.vue';
import AuthView from './views/AuthView.vue';
import AdminView from './views/AdminView.vue';

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

const handleAuth = async (mode: 'login' | 'register', data: any) => {
  try {
    if (mode === 'register') {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      alert('註冊成功！');
    } else {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      alert('登入成功！');
    }
    store.isLoggedIn = true;
    handleNavigate('profile');
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      alert('該電子信箱已被註冊！');
    } else if (error.code === 'auth/invalid-credential') {
      alert('電子信箱或密碼錯誤！');
    } else if (error.code === 'auth/weak-password') {
      alert('密碼強度不足，請至少輸入 6 個字元！');
    } else {
      alert('認證失敗：' + error.message);
    }
  }
};

const searchQuery = ref('');

const handleNavbarSearch = () => {
  if (searchQuery.value.trim() !== '') {
    currentView.value = 'home';
  }
};
</script>

<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-left" @click="handleNavigate('home')">
        <img src="/images/logo.png" class="nav-logo" @contextmenu.prevent="handleNavigate('admin')">
      </div>
      
    <div class="nav-search-wrapper" v-if="currentView === 'home'">
      <input 
        type="text" 
        placeholder="搜尋商品..." 
        class="nav-search-input"
        v-model="searchQuery"
        @keyup.enter="handleNavbarSearch"
      >
    </div>

      <div class="nav-right">
        <a class="nav-link" @click.prevent="handleNavigate('home')">商品</a>
        <a class="nav-link" @click.prevent="handleNavigate('profile')">會員中心</a>
        <a class="nav-link" @click.prevent="handleNavigate('cart')">購物車</a>
        <a class="nav-link" @click.prevent="handleNavigate('admin')" style="color: #5ea6e4;">管理後台</a>
      </div>
    </div>
  </nav>

  <main class="main-content">
    <HomeView v-if="currentView === 'home'" :search-query="searchQuery" @navigate="handleNavigate"@clear-search="searchQuery = ''" />
    <ProductDetailView v-if="currentView === 'detail'" :product-id="selectedProductId || ''" @navigate="handleNavigate" />
    <CartView v-if="currentView === 'cart'" @navigate="handleNavigate" />
    <ProfileView v-if="currentView === 'profile'" @navigate="handleNavigate" @logout="store.isLoggedIn = false; handleNavigate('home')" />
    
    <AuthView v-if="currentView === 'login'" mode="login" @auth-action="(data) => handleAuth('login', data)" @switch-mode="currentView = 'register'" />
    <AuthView v-if="currentView === 'register'" mode="register" @auth-action="(data) => handleAuth('register', data)" @switch-mode="currentView = 'login'" />
    
    <AdminView v-if="currentView === 'admin'" />
  </main>

  <footer class="footer">
    © 2026 Hui. All rights reserved.
  </footer>
</template>