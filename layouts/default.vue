<script setup lang="ts">
import { ref, watchEffect, onMounted, watch } from 'vue';
import '../assets/styles/main.scss';
import Sidebar from '../components/global/sidebar.vue';
import Header from '../components/global/header.vue';

const sideBarItem = ref<{ name: string; path: string; content: string } | null>(
  null
);
const handleSideBarClick = (
  item: { name: string; path: string; content: string },
  event: Event
) => {
  console.log('Sidebar에서 클릭된 아이템:', item);
  sideBarItem.value = item;
};

onMounted(() => {
  const saveItem = localStorage.getItem('sideBarItem');
  if (saveItem) {
    sideBarItem.value = JSON.parse(saveItem);
  }
});

watch(sideBarItem, (newValue) => {
  if (newValue) {
    localStorage.setItem('sideBarItem', JSON.stringify(newValue));
  }
});
</script>

<template>
  <div id="layout" class="flex">
    <Sidebar @click="handleSideBarClick" />
    <div class="page-container">
      <Header :sideBarItem="sideBarItem" />
      <main>
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
#layout {
  height: 100vh;
}
</style>
