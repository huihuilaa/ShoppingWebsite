<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ mode: 'login' | 'register' }>();
const emit = defineEmits(['auth-action', 'switch-mode']);

const email = ref('');
const password = ref('');

const handleSubmit = () => {
  if (!email.value || !password.value) {
    alert('請填寫完整電子信箱與密碼！');
    return;
  }
  emit('auth-action', { email: email.value, password: password.value });
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
          <a href="#" @click.prevent="emit('switch-mode')">
            {{ mode === 'login' ? '還沒有帳號？立即註冊' : '已經有帳號了？返回登入' }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>