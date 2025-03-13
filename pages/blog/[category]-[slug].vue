<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed, onMounted } from 'vue';
import { useAsyncData } from 'nuxt/app';

const route = useRoute();

const routeParams = computed(
  () => route.params['category-slug'] || 'undefined-slug'
);
const category = computed(() => route.params.category || 'undefined');
const slug = computed(() => route.params.slug || 'undefined');

const { data: blog } = await useAsyncData(() => queryContent('blog').find());

const post = computed(() => {
  if (!blog.value) return null;
  return blog.value.find((item: any) => {
    return (
      item.path.replace(/\/$/, '') === `/blog/${category.value}/${slug.value}`
    );
  });
});
</script>

<template>
  <div>
    <h1>{{ post?.title }}</h1>
    <ContentRenderer v-if="post" :value="post" />
  </div>
</template>
