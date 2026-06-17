<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterView, RouterLink, useRouter } from 'vue-router';
import { useShopStore } from './store/shop';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const store = useShopStore();
const router = useRouter();
const searchQuery = ref('');

// Firebase auth 狀態同步
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    store.isLoggedIn = !!user;
    if (user) {
      store.loadCart();
    }
  });
});

const handleNavbarSearch = () => {
  if (searchQuery.value.trim() !== '') {
    router.push({ name: 'home', query: { q: searchQuery.value } });
  }
};

const goAdmin = () => {
  if (!store.isLoggedIn) {
    router.push({ name: 'login' });
    return;
  }
  const code = prompt('請輸入管理員密碼：');
  if (code === 'admin1234') {
    sessionStorage.setItem('adminVerified', 'true');
    router.push({ name: 'admin' });
  } else if (code !== null) {
    alert('密碼錯誤');
  }
};
</script>

<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-left">
        <RouterLink to="/">
          <img src="/images/logo.png" class="nav-logo" @contextmenu.prevent="goAdmin">
        </RouterLink>
      </div>

      <div class="nav-search-wrapper" v-if="$route.name === 'home'">
        <input
          type="text"
          placeholder="搜尋商品..."
          class="nav-search-input"
          v-model="searchQuery"
          @keyup.enter="handleNavbarSearch"
        >
      </div>

      <div class="nav-right">
        <RouterLink class="nav-link" to="/">商品</RouterLink>
        <RouterLink class="nav-link" to="/profile">會員中心</RouterLink>
        <RouterLink class="nav-link" to="/cart">購物車</RouterLink>
        <a class="nav-link" style="color: #5ea6e4; cursor:pointer" @click.prevent="goAdmin">管理後台</a>
      </div>
    </div>
  </nav>

  <main class="main-content">
    <RouterView />
  </main>

  <footer class="footer">
    © 2026 Hui. All rights reserved.
  </footer>
</template>
