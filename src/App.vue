<script setup>
import { RouterView } from 'vue-router';
import { useShopStore } from './store/shop';
import { auth } from './lib/firebase';
import NavBar from './components/ui/NavBar.vue';
import AppFooter from './components/ui/Footer.vue';
import ToastNotify from './components/ui/ToastNotify.vue';
import { toastRef } from './composables/useToast';

const store = useShopStore();

auth.onAuthStateChanged((user) => {
  if (user) {
    store.isLoggedIn = true;
    store.loadCart();
  } else {
    store.isLoggedIn = false;
    store.cartItems = [];
  }
});
</script>

<template>
  <NavBar />
  <main class="main-content">
    <RouterView />
  </main>
  <AppFooter />

  <ToastNotify :ref="(el) => { toastRef.value = el }" />
</template>