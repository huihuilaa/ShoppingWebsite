<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getAllProductsService } from '../api/products';

const router = useRouter();
const route = useRoute();

const products = ref<any[]>([]);
const loading = ref(true);
const sortOrder = ref('default');

const ITEMS_PER_PAGE = 12;
const currentPage = ref(1);

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

// 搜尋：從 URL query 取得
const searchQuery = computed(() => (route.query.q as string) || '');

const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) return products.value;
  const q = searchQuery.value.toLowerCase();
  return products.value.filter(p =>
    p.title?.toLowerCase().includes(q) || p.alias?.toLowerCase().includes(q)
  );
});

const sortedProducts = computed(() => {
  const list = [...filteredProducts.value];
  if (sortOrder.value === 'price-asc') {
    return list.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortOrder.value === 'price-desc') {
    return list.sort((a, b) => Number(b.price) - Number(a.price));
  }
  return list;
});

const totalPages = computed(() =>
  Math.ceil(sortedProducts.value.length / ITEMS_PER_PAGE)
);

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
  return sortedProducts.value.slice(start, start + ITEMS_PER_PAGE);
});

watch([sortOrder, searchQuery], () => {
  currentPage.value = 1;
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
    <!-- 搜尋結果提示 -->
    <div v-if="searchQuery" class="search-result-hint">
      搜尋「{{ searchQuery }}」共 {{ sortedProducts.length }} 筆結果
      <RouterLink to="/" class="clear-search-link">✕ 清除搜尋</RouterLink>
    </div>

    <div class="featured-top-section" v-if="!searchQuery">
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
          @click="router.push(`/product/${product.id}`)"
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
      <p class="empty-products-text">找不到符合的商品。</p>
    </div>

    <template v-else>
      <div class="custom-four-columns">
        <div 
          v-for="product in paginatedProducts" 
          :key="product.id" 
          class="product-card"
          @click="router.push(`/product/${product.id}`)"
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

      <div class="pagination-wrap" v-if="totalPages > 1">
        <button
          class="page-btn"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >‹</button>

        <button
          v-for="page in totalPages"
          :key="page"
          class="page-btn"
          :class="{ active: currentPage === page }"
          @click="currentPage = page"
        >{{ page }}</button>

        <button
          class="page-btn"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >›</button>
      </div>
    </template>
  </div>
</template>
