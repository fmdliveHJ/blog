<script setup>
const { data: posts } = await useAsyncData('posts', () =>
  queryContent('blog').find()
);
</script>

<template>
  <div>
    <h1>블로그 포스트 목록</h1>
    <ul>
      <li v-for="post in posts" :key="post._path">
        <NuxtLink :to="post._path">{{ post.title }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>
