<script setup lang="ts">
import { useAsyncData } from 'nuxt/app';
import { computed, onMounted } from 'vue';
import Icon from '@/components/icon/icon.vue';

const { data: posts } = await useAsyncData('posts', () =>
  queryContent('blog').find()
);

const postList = computed(() => {
  if (!posts.value) return [];
  return (posts.value as any[]).map((post: any) => ({
    ...post,
    slug: post.path.split('/').pop() || '',
  }));
});

const sortedCategories = computed(() => {
  const categoryMap = postList.value.reduce(
    (
      acc: Record<string, { category: string; date: string; count: number }>,
      post
    ) => {
      if (
        !acc[post.category] ||
        new Date(post.date) > new Date(acc[post.category].date)
      ) {
        acc[post.category] = {
          ...post,
          count: (acc[post.category]?.count || 0) + 1,
        };
      } else {
        acc[post.category].count += 1;
      }
      return acc;
    },
    {} as Record<string, { category: string; date: string; count: number }>
  );

  return Object.values(categoryMap)
    .sort(
      (a, b) =>
        b.count - a.count ||
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    .slice(0, 3);
});

const emit = defineEmits(['update-category']);

const mainListClick = (post: any) => {
  console.log(post.name);
  localStorage.setItem('activeItem', post.name);
  emit('update-category', post.name);
};
</script>

<template>
  <div class="flex flex-col gap-4">
    <h3 class="text-[1.5rem] font-medium">Top Category</h3>
    <ul class="flex flex-wrap justify-between gap-4">
      <li
        v-for="post in sortedCategories"
        :key="post.category"
        class="flex items-center w-[30%] h-[7rem] p-[0.5rem] shadow-md rounded-[0.5rem]"
      >
        <NuxtLink
          :to="`/blog/${post.category}`"
          class="flex gap-[2rem]"
          @click="mainListClick(post)"
        >
          <div class="flex justify-center items-center">
            <img
              class="w-[4rem] h-[4rem] rounded-full"
              src="https://placehold.co/50x50"
              alt="post.category"
            />
          </div>
          <div class="flex justify-center items-start flex-col gap-[0.5rem]">
            <p>{{ post.category }}</p>
            <p class="flex items-center gap-[0.5rem]">
              <Icon icon="search" class="w-[1rem] h-[1rem]" />
              <span class="text-[0.8rem]">Articles: {{ post.count }}</span>
            </p>
          </div>
        </NuxtLink>
      </li>
    </ul>

    <h3 class="text-[1.5rem] font-medium mt-[2rem]">Articles</h3>
    <ul v-if="posts" class="flex flex-wrap justify-between gap-4">
      <li
        v-for="post in postList.slice(0, 6)"
        :key="post._path"
        class="w-[30%] p-[0.5rem] shadow-md rounded-[0.5rem]"
      >
        <NuxtLink
          :to="`/blog/${post.category}-${post.slug}`"
          @click="mainListClick(post)"
        >
          <div
            class="flex relative w-full h-[150px] rounded-[0.5rem] overflow-hidden"
          >
            <img class="w-full" :src="post.image" alt="post.title" />
            <span
              class="absolute bottom-0 right-0 bg-black/50 text-white text-[0.8rem] px-2 py-1 rounded-md"
              >{{ post.name }}</span
            >
          </div>
          <div class="flex flex-col h-[5rem] gap-[0.5rem] mt-[1rem]">
            <h4 class="text-[1rem] font-medium">{{ post.title }}</h4>
            <p class="text-[0.8rem] text-gray-500">{{ post.description }}</p>
          </div>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
