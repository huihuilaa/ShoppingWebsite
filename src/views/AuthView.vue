<script setup lang="ts">
import { ref } from 'vue';
defineProps<{ mode: 'login' | 'register' }>();
const emit = defineEmits(['login-success']);
</script>

<template>
  <div class="container main-content auth-page-container">
    <div class="auth-card">
      <h2 class="auth-title">{{ mode === 'login' ? '登入' : '註冊' }}</h2>
      
      <div class="auth-form">
        <div class="auth-field">
          <label>電子信箱</label>
          <input type="email">
        </div>
        <div class="auth-field">
          <label>密碼</label>
          <input type="password">
        </div>
        
        <div class="auth-action-row">
          <button class="pink-btn-rect text-bold" @click="emit('login-success')">
            {{ mode === 'login' ? '登入' : '註冊' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>