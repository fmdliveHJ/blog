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
    <div
      class="flex flex-col items-start w-full pt-10 pl-[2rem] pr-[2rem] md:pl-[2.5rem] md:pr-[2.5rem]"
    >
      <Header :sideBarItem="sideBarItem" />
      <main
        class="w-full min-h-[50%] mt-[2rem] h-[calc(100%-10rem)] max-w-[1200px] mx-0"
      >
        <slot />
      </main>
    </div>
  </div>
</template>

<style>
#layout {
  height: 100%;
  padding-bottom: 5rem;
}
body {
  @apply bg-[#f5f5f6] text-sm;
}
</style>
