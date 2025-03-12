<script setup lang="ts">
import { useAsyncData } from 'nuxt/app';
import { computed, onMounted } from 'vue';

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
</script>

<template>
  <div>
    <h1>블로그 포스트 목록</h1>

    <h3>Top Category</h3>
    <ul>
      <li v-for="post in postList" :key="post._path">
        <NuxtLink :to="`/blog/${post.category}-${post.slug}`">{{
          post.title
        }}</NuxtLink>
      </li>
    </ul>

    <h3>Articles</h3>
    <ul v-if="posts">
      <li v-for="post in postList" :key="post._path">
        <NuxtLink :to="`/blog/${post.category}-${post.slug}`">{{
          post.title
        }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>
