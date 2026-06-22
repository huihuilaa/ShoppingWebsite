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

<style scoped>
.home-custom-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  margin-top: 40px;
}

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
}

/* 搜尋結果提示 */
.clear-search-link {
  margin-left: 12px;
  color: #94a3b8;
  font-size: 0.9rem;
  text-decoration: none;
}
.clear-search-link:hover { color: #ff66a3; }

.filter-search-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 40px 0 30px 0;
  width: 100%;
}
.sort-dropdown-wrapper { position: relative; }
.sort-dropdown {
  border: 1px solid #ccc;
  padding: 6px 12px;
  border-radius: 4px;
  color: #333;
  background-color: #fff;
  cursor: pointer;
}
.sort-dropdown:focus { border-color: #5ea6e4; }

.divider-bottom-spacing {
  margin-top: 5px;
  margin-bottom: 45px;
}

.custom-four-columns {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  padding: 20px 0 60px 0;
  width: 100%;
}
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
.product-card-info {
  width: 100%;
  text-align: left;
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 5px;
  box-sizing: border-box;
}
.product-card-title {
  font-size: 1.05rem;
  color: #2c3e50;
  font-weight: bold;
  line-height: 1.4;
  margin: 0 0 6px 0;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.8em;
}
.product-card-footer {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-top: auto;
}
.product-card-price {
  font-size: 1.2rem;
  color: #ff66a3;
  font-weight: bold;
}
.product-card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.product-card:hover { transform: translateY(-4px); }
.product-card:active { transform: translateY(-1px); }

.pagination-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin: 40px 0 60px 0;
}
.page-btn {
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  color: #1a1a1a;
  font-size: 0.95rem;
  font-weight: 500;
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  box-sizing: border-box;
}
.page-btn:hover:not(:disabled) {
  border-color: #ff66a3;
  color: #ff66a3;
}
.page-btn.active {
  background-color: #ff66a3;
  border-color: #ff66a3;
  color: #ffffff;
  font-weight: bold;
}
.page-btn:disabled {
  color: #cbd5e1;
  cursor: not-allowed;
  border-color: #e2e8f0;
}
</style>
