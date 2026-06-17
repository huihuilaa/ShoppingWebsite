<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useShopStore } from '../store/shop';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, getDocs, startAfter, QueryDocumentSnapshot } from 'firebase/firestore';

const props = defineProps<{ searchQuery: string }>();
const emit = defineEmits(['navigate', 'clear-search']);

const store = useShopStore();
const sortBy = ref('date_desc');
const currentPage = ref(1);
const totalPages = ref(1);
const itemsPerPage = 12;

const pageDocs = ref<(QueryDocumentSnapshot | undefined)[]>([]);

const loadProducts = async () => {
  try {
    const productsRef = collection(db, 'products');
    
    let q;
    if (props.searchQuery.trim() !== '') {
      q = query(productsRef);
    } else {
      let orderField = 'createdAt';
      let orderDirection: 'asc' | 'desc' = 'desc';

      if (sortBy.value === 'price_asc') {
        orderField = 'price';
        orderDirection = 'asc';
      } else if (sortBy.value === 'price_desc') {
        orderField = 'price';
        orderDirection = 'desc';
      }

      if (currentPage.value > 1) {
        const lastDoc = pageDocs.value[currentPage.value - 2];
        if (lastDoc) {
          q = query(
            productsRef,
            orderBy(orderField, orderDirection),
            startAfter(lastDoc),
            limit(itemsPerPage)
          );
        } else {
          q = query(
            productsRef,
            orderBy(orderField, orderDirection),
            limit(itemsPerPage)
          );
        }
      } else {
        q = query(
          productsRef,
          orderBy(orderField, orderDirection),
          limit(itemsPerPage)
        );
      }
    }

    const querySnapshot = await getDocs(q);
    const allDocs = querySnapshot.docs;

    let fetchedProducts = allDocs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[];

    if (props.searchQuery.trim() !== '') {
      fetchedProducts = fetchedProducts.filter(product =>
        product.title?.toLowerCase().includes(props.searchQuery.toLowerCase())
      );
      totalPages.value = 1;
    } else {
      if (currentPage.value === 1 && allDocs.length > 0) {
        pageDocs.value = [];
      }
      if (allDocs.length > 0) {
        pageDocs.value[currentPage.value - 1] = allDocs[allDocs.length - 1];
      }
      
      const totalSnapshot = await getDocs(collection(db, 'products'));
      totalPages.value = Math.ceil(totalSnapshot.size / itemsPerPage) || 1;
    }

    store.products = fetchedProducts;
  } catch (error) {
    console.error(error);
  }
};

const handleClearSearch = () => {
  emit('clear-search');
};

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};

watch(() => props.searchQuery, () => {
  currentPage.value = 1;
  loadProducts();
});

watch([currentPage, sortBy], () => {
  if (props.searchQuery.trim() === '') {
    loadProducts();
  }
});

onMounted(() => {
  loadProducts();
});
</script>

<template>
  <div class="home-banner-container">
    <div class="banner-overlay">
      <h1 class="banner-title">HIMEHINA OFFICIAL SHOP</h1>
      <p class="banner-subtitle">田中音樂堂官方周邊販售商城</p>
    </div>
  </div>

  <div class="container main-content">
    <div class="filter-search-row">
      <div class="sort-select-wrapper" v-if="!props.searchQuery">
        <select v-model="sortBy" class="sort-dropdown">
          <option value="date_desc">最新上架</option>
          <option value="price_asc">價格：低到高</option>
          <option value="price_desc">價格：高到低</option>
        </select>
      </div>
    </div>

    <div class="section-title">
      <span class="blue-sq">■</span> 
      {{ props.searchQuery ? `關鍵字「${props.searchQuery}」的搜尋結果` : '全站商品清單' }}
    </div>

    <div class="products-grid" v-if="store.products && store.products.length > 0">
      <div 
        v-for="product in store.products" 
        :key="product.id" 
        class="product-card"
        @click="emit('navigate', 'detail', product.id)"
      >
        <div class="product-img-wrapper">
          <img :src="product.imageUrl" :alt="product.title" class="product-card-img">
        </div>
        <div class="product-card-info">
          <h3 class="product-card-title">{{ product.title }}</h3>
          <div class="product-card-footer">
            <span class="product-card-price">NT${{ product.price }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="empty-products-container" v-else>
      <p class="empty-products-text">沒有找到任何符合條件的商品。</p>
      <button class="pink-btn-rect" @click="handleClearSearch">返回商品首頁</button>
    </div>

    <div class="pagination-wrapper" v-if="totalPages > 1 && !props.searchQuery">
      <button 
        class="page-nav-btn" 
        :disabled="currentPage === 1" 
        @click="changePage(currentPage - 1)"
      >
        上一頁
      </button>
      
      <div class="page-numbers-list">
        <button
          v-for="page in totalPages"
          :key="page"
          class="page-number-btn"
          :class="{ active: currentPage === page }"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
      </div>

      <button 
        class="page-nav-btn" 
        :disabled="currentPage === totalPages" 
        @click="changePage(currentPage + 1)"
      >
        下一頁
      </button>
    </div>
  </div>
</template>