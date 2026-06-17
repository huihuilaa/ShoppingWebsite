<script setup lang="ts">
import { ref } from 'vue';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const title = ref('');
const price = ref(0);
const imageUrl = ref('');
const specInput = ref('');

const handleUpload = async () => {
  if (!title.value || price.value <= 0 || !imageUrl.value) {
    alert('請填寫完整的商品資訊！');
    return;
  }

  try {
    const productData = {
      title: title.value,
      price: Number(price.value),
      imageUrl: imageUrl.value,
      status: 'published',
      specs: specInput.value ? specInput.value.split(',').map(s => s.trim()) : [],
      createdAt: new Date().getTime()
    };

    await addDoc(collection(db, 'products'), productData);
    alert('商品成功上傳至 Firestore！');

    title.value = '';
    price.value = 0;
    imageUrl.value = '';
    specInput.value = '';
  } catch (error) {
    console.error(error);
    alert('上傳失敗，請檢查 Firebase 主控台的安全規則設定。');
  }
};
</script>

<template>
  <div class="container main-content auth-page-container">
    <div class="auth-card">
      <h2 class="auth-title">上傳新商品 (管理員後台)</h2>
      
      <div class="auth-form">
        <div class="auth-field">
          <label>商品名稱</label>
          <input type="text" v-model="title">
        </div>
        <div class="auth-field">
          <label>商品價格</label>
          <input type="number" v-model="price">
        </div>
        <div class="auth-field">
          <label>圖片路徑或網址</label>
          <input type="text" v-model="imageUrl" placeholder="例如: /images/logo.png">
        </div>
        <div class="auth-field">
          <label>商品規格 (多個請用英文逗號隔開)</label>
          <input type="text" v-model="specInput" placeholder="例如: 豪華盤, 標準盤">
        </div>
        
        <div class="auth-action-row">
          <button class="pink-btn-rect text-bold" @click="handleUpload">
            確認上傳商品
          </button>
        </div>
      </div>
    </div>
  </div>
</template>