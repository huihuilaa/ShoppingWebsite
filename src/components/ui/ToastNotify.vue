<script setup lang="ts">
defineProps<{
  message: string;
  visible: boolean;
}>();

defineEmits(['close']);
</script>

<template>
  <Transition name="toast-fade">
    <div v-if="visible" class="toast-wrapper">
      <div class="toast-content">
        <span class="toast-icon">✨</span>
        <span class="toast-text">{{ message }}</span>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.toast-wrapper {
  position: fixed;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #1e293b;
  color: #ffffff;
  padding: 14px 32px;
  border-radius: 4px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  pointer-events: none;
  border-left: 4px solid #ff66a3;
}
.toast-content { display: flex; align-items: center; gap: 12px; }
.toast-icon { font-size: 1.1rem; }
.toast-text { font-size: 0.95rem; font-weight: bold; letter-spacing: 0.5px; }

.toast-fade-enter-active, .toast-fade-leave-active { transition: all 0.2s ease-out; }
.toast-fade-enter-from, .toast-fade-leave-to { opacity: 0; transform: translate(-50%, -20px); }
</style>