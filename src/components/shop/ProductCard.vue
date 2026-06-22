<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { Product } from '../../types';

const props = defineProps<{
  product: Product;
}>();

const router = useRouter();

const goToDetail = () => {
  router.push({ name: 'detail', params: { id: props.product.id } });
};

const localImages = import.meta.glob('@/assets/images/*', { 
  eager: true, 
  query: '?url',
  import: 'default'
});

const getLocalImage = (dbPath: string) => {
  if (!dbPath) return '';
  
  const filename = dbPath.split('/').pop() || '';
  const matchedKey = Object.keys(localImages).find(key => key.endsWith(filename));

  return matchedKey ? (localImages[matchedKey] as string) : dbPath;
};
</script>

<template>
  <div class="product-card" @click="goToDetail">
    <div class="product-img-wrapper">
      <img :src="getLocalImage(product.imageUrl)" :alt="product.title" class="product-img" />
    </div>
    <div class="product-info">
      <h3 class="product-title">{{ product.title }}</h3>
      <p class="product-price">NT$ {{ product.price }}</p>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  background: #ffffff;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
}
.product-img-wrapper {
  width: 100%;
  padding-top: 100%;
  position: relative;
  background-color: #f8fafc;
}
.product-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.product-info {
  padding: 15px;
  display: flex;
  flex-direction: column;
  flex: 1;
  text-align: left;
}
.product-title {
  font-size: 1rem;
  font-weight: bold;
  color: #334155;
  margin: 0 0 10px 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  height: 2.4rem;
  line-height: 1.2rem;
}
.product-price {
  font-size: 1.1rem;
  font-weight: bold;
  color: #ff66a3;
  margin: auto 0 0 0;
}
</style>