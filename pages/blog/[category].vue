<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted } from 'vue';
import { useAsyncData } from 'nuxt/app';

const route = useRoute();
const category = computed(() => route.params.category);
const { data: blog } = await useAsyncData(() => queryContent('blog').find());

const filteredData = computed(() => {
  if (!blog.value) return [];
  return (blog.value as any[])
    .filter((item: any) => item.category === category.value)
    .map((item: any) => ({
      ...item,
      slug: item.path.split('/').pop() || '',
    }));
});
</script>

<template>
  <div>
    <ul class="flex flex-wrap w-full mx-[-0.5rem]">
      <li
        v-for="item in filteredData.slice(0, 9)"
        :key="item.slug"
        class="w-[calc(33.3333%-1rem)] p-[0.5rem] shadow-md rounded-[0.5rem] mx-[0.5rem] mb-[1rem]"
      >
        <NuxtLink :to="`/blog/${category}-${item.slug}`">
          <div
            class="flex relative w-full h-[150px] rounded-[0.5rem] overflow-hidden"
          >
            <img class="w-full" :src="item.image" alt="post.title" />
            <span
              class="absolute bottom-0 right-0 bg-black/50 text-white text-[0.8rem] px-2 py-1 rounded-md"
              >{{ item.category }}</span
            >
          </div>
          <div class="flex flex-col h-[5rem] gap-[0.5rem] mt-[1rem]">
            <h4 class="text-[1rem] font-medium">{{ item.title }}</h4>
            <p class="text-[0.8rem] text-gray-500">{{ item.description }}</p>
            <span class="text-[0.8rem] text-gray-500">{{ item.date }}</span>
          </div>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
li {
  cursor: pointer;
}
</style>
