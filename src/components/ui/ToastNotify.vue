<script setup lang="ts">
import { ref } from 'vue';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

const toasts = ref<Toast[]>([]);
let counter = 0;

const show = (message: string, type: 'success' | 'error' = 'success') => {
  const id = counter++;
  toasts.value.push({ id, message, type });
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  }, 3000);
};

defineExpose({ show });
</script>

<template>
  <div class="toast-container">
    <transition-group name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="toast.type"
      >
        <span class="toast-icon">{{ toast.type === 'success' ? '✓' : '✕' }}</span>
        {{ toast.message }}
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 80px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: bold;
  color: #ffffff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  min-width: 220px;
  max-width: 340px;
}

.toast.success { background-color: #4caf82; }
.toast.error   { background-color: #e05c5c; }

.toast-icon {
  font-size: 1rem;
  flex-shrink: 0;
}

.toast-enter-active { transition: all 0.3s ease; }
.toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from  { opacity: 0; transform: translateX(40px); }
.toast-leave-to    { opacity: 0; transform: translateX(40px); }
</style>