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
