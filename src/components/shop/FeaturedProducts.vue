<script setup lang="ts">
import { useRouter } from 'vue-router';

// 接收來自首頁撈取好的推薦商品陣列
defineProps<{
  products: any[];
}>();

const router = useRouter();

// 👑 符合最新 Vite 規範的動態資產引入，自動掃描本地圖片
const localImages = import.meta.glob('@/assets/images/*', { 
  eager: true, 
  query: '?url', 
  import: 'default' 
}) as Record<string, string>;

const getLocalImage = (dbPath: string): string => {
  if (!dbPath) return '';
  const filename = dbPath.split('/').pop() || '';
  const matchedKey = Object.keys(localImages).find(key => key.endsWith(filename));
  return matchedKey ? localImages[matchedKey] || dbPath : dbPath;
};
</script>

<template>
  <div class="featured-top-section">
    <div class="custom-title-style">
      <span class="blue-sq">■</span>推薦商品<span class="en">FEATURED PRODUCTS</span>
    </div>
    <hr class="section-divider">
    
    <div class="featured-grid">
      <div 
        v-for="product in products" 
        :key="product.id" 
        class="featured-card"
        @click="router.push(`/product/${product.id}`)"
      >
        <div class="product-img-wrapper">
          <img :src="getLocalImage(product.imageUrl)" :alt="product.title" class="product-card-img">
        </div>
        <div class="featured-card-info">
          <h4 class="product-card-title">{{ product.title }}</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.featured-top-section {
  width: 100%;
  margin-bottom: 20px;
}
.featured-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-bottom: 40px;
}
.featured-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.featured-card:hover { transform: translateY(-4px); }

.product-img-wrapper {
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
}
.product-card-img { width: 100%; height: 100%; object-fit: cover; }

.featured-card-info {
  width: 100%;
  text-align: center;
  margin-top: 15px;
}
.featured-card-info .product-card-title {
  text-align: center;
  justify-content: center;
  height: auto;
  min-height: unset;
  margin: 0;
  color: #1a252f;
  font-size: 1.1rem;
  font-weight: bold;
}
</style>