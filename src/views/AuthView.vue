<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const route = useRoute();
const router = useRouter();

// ✅ 直接從動態路由名稱推導 mode
const isLogin = computed(() => route.name === 'login');

const email = ref('');
const password = ref('');

const handleSubmit = async () => {
  if (!email.value || !password.value) return;
  try {
    if (isLogin.value) {
      await signInWithEmailAndPassword(auth, email.value, password.value);
      // 自動跳轉回原頁面或會員中心
      const redirectPath = route.query.redirect || '/profile';
      router.push(redirectPath.toString());
    } else {
      await createUserWithEmailAndPassword(auth, email.value, password.value);
      alert('註冊成功！');
      router.push('/profile');
    }
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};
</script>

<template>
  <div class="auth-container">
    <h2>{{ isLogin ? '會員登入' : '新會員註冊' }}</h2>
    <form @submit.prevent="handleSubmit" class="auth-form">
      <div class="form-group">
        <label>Email</label>
        <input type="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label>密碼</label>
        <input type="password" v-model="password" required>
      </div>
      <button type="submit" class="btn-submit">
        {{ isLogin ? '登入' : '註冊' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.auth-page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 60px;
  padding-bottom: 100px;
}
.auth-card {
  background-color: #ffffff;
  border: 1px solid #dcdcdc;
  padding: 60px 40px;
  width: 100%;
  max-width: 900px;
  min-height: 400px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.auth-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1a1a1a;
  margin: 0 0 35px 0;
  text-align: center;
  width: 100%;
}
.auth-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
}
.auth-field {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  max-width: 380px;
}
.auth-field label {
  font-size: 1.1rem;
  font-weight: bold;
  color: #1a1a1a;
  margin-bottom: 8px;
}
.auth-field input {
  width: 100%;
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 0;
  font-size: 1rem;
  color: #1a1a1a;
  outline: none;
  box-sizing: border-box;
  background-color: #f0f4f8;
}
.auth-field input:focus {
  border-color: #5ea6e4;
  background-color: #ffffff;
}
.auth-action-row {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 10px;
}
.auth-action-row .pink-btn-rect {
  width: 100%;
  max-width: 380px;
}
.auth-switch-links { margin-top: 15px; text-align: center; }
.auth-switch-links a {
  color: #767676;
  font-size: 0.95rem;
  text-decoration: underline;
  font-weight: bold;
  transition: color 0.2s;
}
.auth-switch-links a:hover { color: #ff66a3; }
</style>