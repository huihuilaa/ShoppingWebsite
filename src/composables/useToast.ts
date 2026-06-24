import { ref } from 'vue';

export const toastRef = ref<any>(null);

export const useToast = () => {
  const show = (message: string, type: 'success' | 'error' = 'success') => {
    toastRef.value?.show(message, type);
  };
  return { show };
};