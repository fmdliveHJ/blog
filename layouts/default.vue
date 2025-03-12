<script setup lang="ts">
import '../assets/styles/main.css';
import Sidebar from '../components/global/sidebar.vue';
import Header from '../components/global/header.vue';

const sideBarItem = ref<{ name: string; path: string; content: string } | null>(
  null
);
const handleSideBarClick = (
  item: { name: string; path: string; content: string },
  event: Event
) => {
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
  <div id="layout" class="flex gap-20">
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
