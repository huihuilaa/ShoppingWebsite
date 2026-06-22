<script setup>
import { onMounted } from 'vue';
import { RouterLink, RouterView, useRouter } from 'vue-router';
import { useShopStore } from './store/shop';
import { auth } from './lib/firebase';
import { signOut } from 'firebase/auth';

const store = useShopStore();
const router = useRouter();

auth.onAuthStateChanged((user) => {
  if (user) {
    store.isLoggedIn = true;
    store.loadCart();
  } else {
    store.isLoggedIn = false;
    store.cartItems = [];
  }
});

const handleLogout = async () => {
  try {
    await signOut(auth);
    sessionStorage.removeItem('adminVerified');
    router.push('/');
  } catch (error) {
    console.error('登出失敗:', error);
  }
};

const goAdmin = () => {
  const password = prompt('請輸入管理員密碼：');
  if (password === 'admin123') {
    sessionStorage.setItem('adminVerified', 'true');
    router.push('/admin');
  } else {
    alert('密碼錯誤！');
  }
};
</script>

<template>
  <header class="navbar">
    <div class="nav-container">
      <div class="nav-left">
        <RouterLink to="/" class="nav-logo-link">
          <img src="/images/logo.png" alt="Logo" class="nav-logo">
        </RouterLink>
      </div>

      <div class="nav-right">
        <RouterLink class="nav-link" to="/">商品列表</RouterLink>

        <template v-if="!store.isLoggedIn">
          <RouterLink class="nav-link" to="/login">登入</RouterLink>
          <RouterLink class="nav-link nav-link--register" to="/register">註冊</RouterLink>
        </template>

        <template v-else>
          <RouterLink class="nav-link" to="/profile">會員中心</RouterLink>
          <RouterLink class="nav-link nav-link--cart" to="/cart">
            購物車
            <span v-if="store.cartItems.length > 0" class="cart-badge">
              {{ store.cartItems.length }}
            </span>
          </RouterLink>
          <button class="nav-link nav-link--logout" @click="handleLogout">登出</button>
        </template>

        <span class="admin-trigger" @contextmenu.prevent="goAdmin"></span>
      </div>
    </div>
  </header>

  <main class="main-content">
    <RouterView />
  </main>

  <footer class="footer">
    <p>&copy; 2026 HimeHina Fan Club Shop. All Rights Reserved.</p>
  </footer>
</template>

<style scoped>
/* Navbar */
.navbar {
  width: 100%;
  background-color: #f0f4f8;
  border-bottom: 1px solid #dcdcdc;
  padding: 10px 0;
  box-sizing: border-box;
}
.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}
.nav-left {
  cursor: pointer;
  display: flex;
  align-items: center;
}
.nav-logo { height: 50px; width: auto; }

.nav-search-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  max-width: 400px;
  margin: 0 20px;
}
.nav-search-input {
  width: 100%;
  height: 32px;
  background-color: #f0f4f8;
  border: 1px solid #cbd5e1;
  border-radius: 0;
  padding: 0 12px;
  box-sizing: border-box;
  outline: none;
  font-size: 0.9rem;
  color: #1a1a1a;
  transition: all 0.2s;
}
.nav-search-input::placeholder { color: #94a3b8; }
.nav-search-input:focus {
  border-color: #5ea6e4;
  background-color: #ffffff;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 25px;
}
.nav-link {
  color: #1a1a1a;
  text-decoration: none;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: bold;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 4px;
  transition: background-color 0.15s ease, color 0.15s ease;
}
.nav-link:hover {
  background-color: #f0f4f8;
  color: #ff66a3;
}
.nav-link:active { background-color: #e2e8f0; }

.cart-icon-btn {
  position: relative;
  font-size: 1.1rem;
  text-decoration: none;
}
.cart-badge {
  position: absolute;
  top: -8px;
  right: -10px;
  background: #ff66a3;
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 10px;
  line-height: 1;
}
</style>