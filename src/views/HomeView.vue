<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getAllProductsService } from '../api/products';

const emit = defineEmits<{
  (e: 'navigate', view: string, productId?: string): void
}>();

const products = ref<any[]>([]);
const loading = ref(true);
const sortOrder = ref('default');

const loadAllProducts = async () => {
  try {
    loading.value = true;
    products.value = await getAllProductsService();
  } catch (error) {
    console.error('無法載入商品清單');
  } finally {
    loading.value = false;
  }
};

const sortedProducts = computed(() => {
  const list = [...products.value];
  if (sortOrder.value === 'price-asc') {
    return list.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortOrder.value === 'price-desc') {
    return list.sort((a, b) => Number(b.price) - Number(a.price));
  }
  return list;
});

const featuredProducts = computed(() => {
  return products.value.slice(0, 3);
});

onMounted(() => {
  loadAllProducts();
});
</script>

<template>
  <div class="home-custom-layout">
    <div class="featured-top-section">
      <div class="custom-title-style">
        <span class="blue-sq">■</span>推薦商品<span class="en">FEATURED PRODUCTS</span>
      </div>
      <hr class="section-divider">
      
      <div v-if="loading" class="empty-products-text text-center">
        商品載入中...
      </div>
      
      <div v-else class="featured-grid">
        <div 
          v-for="product in featuredProducts" 
          :key="product.id" 
          class="featured-card"
          @click="emit('navigate', 'detail', product.id)"
        >
          <div class="product-img-wrapper">
            <img :src="product.imageUrl" :alt="product.title" class="product-card-img">
          </div>
          <div class="featured-card-info">
            <h4 class="product-card-title">{{ product.title }}</h4>
          </div>
        </div>
      </div>
    </div>

    <div class="filter-search-row">
      <div class="custom-title-style">
        <span class="blue-sq">■</span>所有商品<span class="en">ALL PRODUCTS</span>
      </div>
      
      <div class="sort-dropdown-wrapper">
        <select v-model="sortOrder" class="sort-dropdown">
          <option value="default">預設排序</option>
          <option value="price-asc">價格：由低到高</option>
          <option value="price-desc">價格：由高到低</option>
        </select>
      </div>
    </div>
    <hr class="section-divider divider-bottom-spacing">

    <div v-if="loading" class="empty-products-text text-center">
      商品列表載入中...
    </div>

    <div v-else-if="sortedProducts.length === 0" class="empty-products-container">
      <p class="empty-products-text">目前沒有任何商品。</p>
    </div>

    <div v-else class="custom-four-columns">
      <div 
        v-for="product in sortedProducts" 
        :key="product.id" 
        class="product-card"
        @click="emit('navigate', 'detail', product.id)"
      >
        <div class="product-img-wrapper">
          <img :src="product.imageUrl" :alt="product.title" class="product-card-img">
        </div>
        <div class="product-card-info">
          <h4 class="product-card-title">{{ product.title }}</h4>
          <div class="product-card-footer">
            <div class="product-card-price">NT${{ product.price }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>