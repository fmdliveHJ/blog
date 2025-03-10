<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted } from 'vue';
import { useAsyncData } from 'nuxt/app';

const route = useRoute();
const category = computed(() => route.params.category);
const { data: blog } = await useAsyncData(() => queryContent('blog').find());

const filteredData = computed(() => {
  if (!blog.value) return [];
  return blog.value
    .filter((item) => item.category === category.value)
    .map((item) => ({
      ...item,
      slug: item.path.split('/').pop() || '',
    }));
});

onMounted(() => {
  console.log(category.value);
  console.log(blog.value);
  console.log(filteredData.value);
});
</script>

<template>
  <div>
    <h1>{{ category }}</h1>
    <ul>
      <li v-for="item in filteredData" :key="item.slug">
        <NuxtLink :to="`/blog/${category}-${item.slug}`">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
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
