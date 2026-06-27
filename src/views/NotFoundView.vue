<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<template>
  <div class="not-found-container">
    <h1 class="not-found-code">404</h1>
    <p class="not-found-msg">找不到這個頁面</p>
    <button class="pink-btn-rect" @click="router.push('/')">返回首頁</button>
  </div>
</template>

<style scoped>
.not-found-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 20px;
  text-align: center;
}
.not-found-code {
  font-size: 6rem;
  font-weight: bold;
  color: #ff66a3;
  margin: 0;
}
.not-found-msg {
  font-size: 1.25rem;
  color: #767676;
  margin: 20px 0 40px;
}
</style>