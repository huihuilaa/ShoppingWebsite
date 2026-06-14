<script setup lang="ts">
import { ref, computed } from 'vue';
import { useShopStore } from '../store/shop';

const emit = defineEmits<{
  (e: 'navigate', view: string, id?: string): void
}>();

const store = useShopStore();
const sortBy = ref('latest');
const currentPage = ref(1);

const sortedProducts = computed(() => {
  const list = [...store.publishedProducts];
  if (sortBy.value === 'price-low') return list.sort((a, b) => a.price - b.price);
  if (sortBy.value === 'price-high') return list.sort((a, b) => b.price - a.price);
  return list;
});
</script>

<template>
  <div class="container">
    <div class="custom-divider top-line">
      <div class="thick-black-line"></div>
      <div class="thin-gray-line"></div>
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
      <div class="thin-gray-line"></div>
    </div>

    <div class="filter-bar">
      <div class="section-title"><span class="blue-sq">■</span> 所有商品 <span class="en">ALL PRODUCTS</span></div>
      <div class="select-wrapper">
        <select v-model="sortBy" class="sort-select">
          <option value="latest">最新上架 &nbsp;v</option>
          <option value="price-low">價格：低到高 &nbsp;v</option>
          <option value="price-high">價格：高到低 &nbsp;v</option>
        </select>
      </div>
    </div>

    <section class="products-section">
      <div class="grid grid-4">
        <div v-for="p in sortedProducts" :key="p.id" class="product-card" @click="emit('navigate', 'detail', p.id)">
          <div class="img-wrap"><img :src="p.imageUrl" loading="lazy"></div>
            <div class="p-info">
              <div class="p-title">{{ p.title }}</div>
              <div class="p-alias" v-if="p.alias">{{ p.alias }}</div>
              <div class="p-price">NT${{ p.price }}</div>
            </div>
        </div>
      </div>
    </section>

    <div class="custom-divider bottom-line">
      <div class="thick-black-line"></div>
      <div class="thin-gray-line"></div>
    </div>

    <div class="pagination">
      <button class="page-btn" :class="{ active: currentPage === 1 }" @click="currentPage = 1">1</button>
      <button class="page-btn" :class="{ active: currentPage === 2 }" @click="currentPage = 2">2</button>
      <button class="page-btn" :class="{ active: currentPage === 3 }" @click="currentPage = 3">3</button>
      <span class="dots">...</span>
      <button class="page-btn" :class="{ active: currentPage === 5 }" @click="currentPage = 5">5</button>
    </div>
  </div>
</template>