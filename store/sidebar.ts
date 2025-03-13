import { defineStore } from 'pinia';
import { ref, onMounted } from 'vue';

export const useSidebarStore = defineStore('sidebar', () => {
  const selectedItems = ref('');

  const addSelectedItem = (name: string) => {
    selectedItems.value = name;
    if (process.client) {
      localStorage.setItem('selectedItems', name);
    }
  };

  const removeSelectedItem = () => {
    selectedItems.value = '';
    if (process.client) {
      localStorage.removeItem('selectedItems');
    }
  };

  const clearSelectedItems = () => {
    selectedItems.value = '';
    if (process.client) {
      localStorage.removeItem('selectedItems');
    }
  };

  onMounted(() => {
    if (process.client) {
      const savedItem = localStorage.getItem('selectedItems');
      if (savedItem) {
        selectedItems.value = savedItem;
      }
    }
  });

  return {
    selectedItems,
    addSelectedItem,
    removeSelectedItem,
    clearSelectedItems,
  };
});
