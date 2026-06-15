<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useShopStore } from '../store/shop';

const emit = defineEmits<{
  (e: 'navigate', view: string, id?: string): void
}>();

const store = useShopStore();
const sortBy = ref('latest');
const currentPage = ref(1);
const itemsPerPage = 12;

const sortedProducts = computed(() => {
  const list = [...store.publishedProducts];
  if (sortBy.value === 'price-low') return list.sort((a, b) => a.price - b.price);
  if (sortBy.value === 'price-high') return list.sort((a, b) => b.price - a.price);
  return list;
});

const totalPages = computed(() => {
  return Math.ceil(sortedProducts.value.length / itemsPerPage);
});

const displayedProducts = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return sortedProducts.value.slice(startIndex, endIndex);
});

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

watch(sortBy, () => {
  currentPage.value = 1;
});
</script>

<template>
  <div class="container">
    <div class="custom-divider top-line">
      <div class="thick-black-line"></div>     
    </div>

    <section class="featured-section">
      <div class="grid grid-3">
        <div v-for="p in store.featuredProducts" :key="p.id" class="product-card" @click="emit('navigate', 'detail', p.id)">
          <div class="img-wrap"><img :src="p.imageUrl" loading="lazy"></div>
          <div class="p-info">
            <div class="p-title pre-line">{{ p.title }} {{ p.alias }}</div>
          </div>
        </div>
      </div>
    </section>

    <div class="custom-divider">
      <div class="thick-black-line"></div>
    </div>

    <div class="filter-bar">
      <div class="section-title"><span class="blue-sq">■</span> 所有商品 <span class="en">ALL PRODUCTS</span></div>
      <div class="select-wrapper">
        <select v-model="sortBy" class="sort-select">
          <option value="latest">最新上架</option>
          <option value="price-low">價格：低到高</option>
          <option value="price-high">價格：高到低</option>
        </select>
      </div>
    </div>

    <section class="products-section">
      <div class="grid grid-4">
        <div v-for="p in displayedProducts" :key="p.id" class="product-card" @click="emit('navigate', 'detail', p.id)">
          <div class="img-wrap"><img :src="p.imageUrl" loading="lazy"></div>
          <div class="p-info">
            <h3 class="p-title">
              {{ p.title }}
              <span class="p-alias" v-if="p.alias">{{ p.alias }}</span>
            </h3>
            <div class="p-price">NT${{ p.price }}</div>
          </div>
        </div>
      </div>
    </section>

    <div class="custom-divider bottom-line">
      <div class="thick-black-line"></div>
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <button class="page-btn" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
        &lt;
      </button>
      
      <button v-for="page in totalPages" :key="page" class="page-btn":class="{ active: currentPage === page } "@click="changePage(page)">
        {{ page }}
      </button>
      
      <button class="page-btn" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
        &gt;
      </button>
    </div>
  </div>
</template>