<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getAllProductsService } from '../api/products';
import ProductCard from '../components/shop/ProductCard.vue';
import FeaturedProducts from '../components/shop/FeaturedProducts.vue';

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

    <div v-if="loading" class="empty-products-text text-center">
      商品載入中...
    </div>

    <template v-else>
      <FeaturedProducts 
        v-if="!searchQuery" 
        :products="featuredProducts" 
      />

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

      <div v-if="sortedProducts.length === 0" class="empty-products-container">
        <p class="empty-products-text">找不到符合的商品。</p>
      </div>

      <template v-else>
        <div class="custom-four-columns">
          <ProductCard 
            v-for="product in paginatedProducts" 
            :key="product.id" 
            :product="product" 
          />
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
.empty-products-text {
  color: #94a3b8;
  font-size: 1.1rem;
  text-align: center;
  padding: 60px 0;
}
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