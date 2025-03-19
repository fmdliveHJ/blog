<script setup lang="ts">
import '../assets/styles/main.css';
import Sidebar from '../components/global/sidebar.vue';
import Header from '../components/global/header.vue';
import { ref, onMounted, watch, provide } from 'vue';

const { data: posts } = await useAsyncData('posts', () =>
  queryContent('blog').find()
);

const categoryCounts = computed(() => {
  if (!posts.value) return {};

  return posts.value.reduce((acc: Record<string, number>, post: any) => {
    if (post.category) {
      acc[post.category] = (acc[post.category] || 0) + 1;
    }
    return acc;
  }, {});
});

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
  console.log(categoryCounts.value);
  if (process.client) {
    const saveItem = localStorage.getItem('sideBarItem');
    if (saveItem) {
      sideBarItem.value = JSON.parse(saveItem);
    }
  }
});

watch(sideBarItem, (newValue) => {
  if (newValue) {
    if (process.client) {
      localStorage.setItem('sideBarItem', JSON.stringify(newValue));
    }
  }
});

provide('categoryCounts', categoryCounts);
</script>

<template>
  <div id="layout" class="flex">
    <Sidebar @click="handleSideBarClick" :categoryCounts="categoryCounts" />
    <div class="page-container w-full pt-10 pl-20 pr-20">
      <Header :sideBarItem="sideBarItem" />
      <main class="mt-[2rem] h-[calc(100%-10rem)] overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<style>
#layout {
  height: 100vh;
}
body {
  @apply bg-[#f5f5f6] text-sm;
}
</style>
