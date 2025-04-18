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
      post: { category: string; date: string; count: number }
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
  localStorage.setItem('activeItem', post.name);
  emit('update-category', post.name);
};
</script>

<template>
  <div class="flex flex-col gap-2 md:gap-4">
    <h3 class="text-[1rem] md:text-[1.5rem] font-medium font-outfit">
      Top Category
    </h3>
    <ul class="flex flex-wrap mx-[0] md:mx-[-0.5rem]">
      <li
        v-for="post in sortedCategories"
        :key="post.category"
        class="flex items-center w-[100%] md:w-[calc(50%-0.5rem)] lg:w-[calc(33.3333%-1rem)] mx-[0] md:mx-[0.5rem] h-[5rem] md:h-[7rem] p-[0.5rem] shadow-md rounded-[0.5rem] bg-white"
      >
        <NuxtLink
          :to="`/blog/${post.category}`"
          class="flex gap-[1rem] md:gap-[2rem]"
          @click="mainListClick(post)"
        >
          <div class="flex justify-center items-center">
            <img
              class="w-[3rem] h-[3rem] md:w-[4rem] md:h-[4rem] rounded-full"
              src="https://placehold.co/50x50"
              alt="post.category"
            />
          </div>
          <div class="flex justify-center items-start flex-col gap-[0.5rem]">
            <p class="font-outfit">{{ post.name }}</p>
            <p class="flex items-center gap-[0.5rem]">
              <Icon icon="doc" class="w-[1rem] h-[1rem]" />
              <span class="text-[0.8rem] font-outfit"
                >Articles: {{ post.count }}</span
              >
            </p>
          </div>
        </NuxtLink>
      </li>
    </ul>

    <h3 class="text-[1rem] md:text-[1.5rem] font-medium mt-[2rem] font-outfit">
      Articles
    </h3>
    <ul v-if="posts" class="flex flex-wrap mx-[0] md:mx-[-0.5rem]">
      <li
        v-for="post in postList.slice(0, 6)"
        :key="post._path"
        class="w-[100%] md:w-[calc(50%-0.5rem)] lg:w-[calc(33.3333%-1rem)] mx-[0] md:mx-[0.5rem] mb-[1rem] p-[0.5rem] shadow-md rounded-[0.5rem] bg-white"
      >
        <NuxtLink
          :to="`/blog/${post.category}-${post.slug}`"
          @click="mainListClick(post)"
        >
          <div
            class="flex relative w-full h-[8rem] md:h-[10rem] rounded-[0.5rem] overflow-hidden"
          >
            <img class="w-full" :src="post.image" alt="post.title" />
            <span
              class="absolute bottom-0 right-0 bg-black/50 text-white text-[0.8rem] px-2 py-1 rounded-md"
              >{{ post.name }}</span
            >
          </div>
          <div
            class="flex flex-col h-[4rem] md:h-[5rem] gap-[0.25rem] md:gap-[0.5rem] mt-[1rem]"
          >
            <h4
              class="text-[0.8rem] md:text-[1rem] lg:text-[1.25rem] font-medium text-ellipsis overflow-hidden whitespace-nowrap"
            >
              {{ post.title }}
            </h4>
            <p
              class="text-[0.6rem] md:text-[0.8rem] lg:text-[1rem] text-gray-500 text-ellipsis overflow-hidden whitespace-nowrap"
            >
              {{ post.description }}
            </p>
            <p
              class="text-[0.6rem] md:text-[0.8rem] lg:text-[1rem] text-gray-500 text-ellipsis overflow-hidden whitespace-nowrap"
            >
              {{ post.date }}
            </p>
          </div>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
