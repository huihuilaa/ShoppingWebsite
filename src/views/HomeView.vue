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

const lastVisibleDoc = ref<QueryDocumentSnapshot | null>(null);
const firstVisibleDoc = ref<QueryDocumentSnapshot | null>(null);
const featuredProducts = ref<any[]>([]);

const loadFeaturedProducts = async () => {
  try {
    const q = query(collection(db, 'products'));
    const querySnapshot = await getDocs(q);
    const all = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[];
    
    featuredProducts.value = all.filter(p => p.title && p.title.includes('ヒメヒナミニぬい')).slice(0, 3);
  } catch (error) {
    console.error(error);
  }
};

const loadProducts = async () => {
  try {
    const productsRef = collection(db, 'products');
    
    let orderField = 'createdAt';
    let orderDirection: 'asc' | 'desc' = 'desc';

    if (sortBy.value === 'price_asc') {
      orderField = 'price';
      orderDirection = 'asc';
    } else if (sortBy.value === 'price_desc') {
      orderField = 'price';
      orderDirection = 'desc';
    }

    let q = query(productsRef, orderBy(orderField, orderDirection), limit(itemsPerPage));

    if (props.searchQuery.trim() === '') {
      const totalSnapshot = await getDocs(collection(db, 'products'));
      totalPages.value = Math.ceil(totalSnapshot.size / itemsPerPage) || 1;
      
      if (currentPage.value > 1 && lastVisibleDoc.value) {
        q = query(
          productsRef,
          orderBy(orderField, orderDirection),
          startAfter(lastVisibleDoc.value),
          limit(itemsPerPage)
        );
      }
    } else {
      q = query(productsRef);
      totalPages.value = 1;
    }

    const querySnapshot = await getDocs(q);
    const allDocs = querySnapshot.docs;

    if (allDocs.length > 0) {
      firstVisibleDoc.value = allDocs[0] as QueryDocumentSnapshot;
      lastVisibleDoc.value = allDocs[allDocs.length - 1] as QueryDocumentSnapshot;
    } else {
      lastVisibleDoc.value = null;
    }

    let fetchedProducts = allDocs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[];

    if (props.searchQuery.trim() !== '') {
      fetchedProducts = fetchedProducts.filter(product =>
        product.title?.toLowerCase().includes(props.searchQuery.toLowerCase())
      );
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
  lastVisibleDoc.value = null;
  loadProducts();
});

watch([currentPage, sortBy], () => {
  if (props.searchQuery.trim() === '') {
    if (currentPage.value === 1) {
      lastVisibleDoc.value = null;
    }
    loadProducts();
  }
});

onMounted(() => {
  loadFeaturedProducts();
  loadProducts();
});
</script>

<template>
  <div class="container main-content home-custom-layout">
    
    <div class="featured-top-section" v-if="featuredProducts.length > 0 && !props.searchQuery">
      <div class="featured-grid">
        <div 
          v-for="product in featuredProducts" 
          :key="'feat-' + product.id" 
          class="featured-card"
          @click="emit('navigate', 'detail', product.id)"
        >
          <div class="product-img-wrapper">
            <img :src="product.imageUrl" :alt="product.title" class="product-card-img">
          </div>
          <div class="featured-card-info">
            <h3 class="product-card-title">{{ product.title }}</h3>
          </div>
        </div>
      </div>
      <hr class="section-divider">
    </div>

    <div class="filter-search-row">
      <div class="section-title custom-title-style">
        <span class="blue-sq">■</span> 
        {{ props.searchQuery ? `搜尋結果「${props.searchQuery}」` : '所有商品 ALL PRODUCTS' }}
      </div>
      
      <div class="sort-select-wrapper" v-if="!props.searchQuery">
        <select v-model="sortBy" class="sort-dropdown">
          <option value="date_desc">最新上架</option>
          <option value="price_asc">價格：低到高</option>
          <option value="price_desc">價格：高到低</option>
        </select>
      </div>
    </div>
    
    <hr class="section-divider divider-bottom-spacing">

    <div class="products-grid custom-four-columns" v-if="store.products && store.products.length > 0">
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