<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useShopStore } from '../store/shop';
import { auth } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const props = defineProps<{ mode: 'login' | 'register' }>();

const router = useRouter();
const route = useRoute();
const store = useShopStore();

const email = ref('');
const password = ref('');

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    alert('請填寫完整電子信箱與密碼！');
    return;
  }
  try {
    if (props.mode === 'register') {
      await createUserWithEmailAndPassword(auth, email.value, password.value);
      alert('註冊成功！');
    } else {
      await signInWithEmailAndPassword(auth, email.value, password.value);
      alert('登入成功！');
    }
    store.isLoggedIn = true;
    const redirect = route.query.redirect as string | undefined;
    router.push(redirect || '/profile');
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
</script>

<template>
  <div class="container main-content auth-page-container">
    <div class="auth-card">
      <h2 class="auth-title">{{ mode === 'login' ? '登入' : '註冊' }}</h2>
      
      <div class="auth-form">
        <div class="auth-field">
          <label>電子信箱</label>
          <input type="email" v-model="email">
        </div>
        <div class="auth-field">
          <label>密碼</label>
          <input type="password" v-model="password">
        </div>
        
        <div class="auth-action-row">
          <button class="pink-btn-rect text-bold" @click="handleSubmit">
            {{ mode === 'login' ? '登入' : '註冊' }}
          </button>
        </div>

        <div class="auth-switch-links">
          <RouterLink :to="mode === 'login' ? '/register' : '/login'">
            {{ mode === 'login' ? '還沒有帳號？立即註冊' : '已經有帳號了？返回登入' }}
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
