<script setup lang="ts">
import { ref } from 'vue';
defineProps<{ mode: 'login' | 'register' }>();
const emit = defineEmits(['switch-mode', 'login-success']);
</script>

<template>
  <div class="auth-screen-overlay">
    <div class="auth-card">
      <h2 class="auth-title">{{ mode === 'login' ? '登入' : '註冊' }}</h2>
      
      <div class="auth-form">
        <div class="auth-field">
          <label>電子信箱</label>
          <input type="email" placeholder="請輸入電子信箱">
        </div>
        <div class="auth-field">
          <label>密碼</label>
          <input type="password" placeholder="請輸入密碼">
        </div>
        
        <button class="pink-btn-rect text-bold full-width" @click="emit('login-success')">
          {{ mode === 'login' ? '登入' : '註冊' }}
        </button>

        <div class="auth-switch-link">
          <a href="#" @click.prevent="emit('switch-mode')">
            {{ mode === 'login' ? '還沒有帳號？前往註冊' : '已有帳號？前往登入' }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>