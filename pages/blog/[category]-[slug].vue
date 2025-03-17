<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed, onMounted } from 'vue';
import { useAsyncData } from 'nuxt/app';

const route = useRoute();

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
  <div class="content bg-white p-[2rem] rounded-[1rem]">
    <h1>{{ post?.title }}</h1>
    <ContentRenderer v-if="post" :value="post" />
  </div>
</template>

<style scoped>
.content p:not(:last-child),
.content li:not(:last-child),
.content blockquote:not(:last-child),
.content h1:not(:last-child),
.content h2:not(:last-child),
.content h3:not(:last-child),
.content h4:not(:last-child),
.content pre:not(:last-child),
.content table:not(:last-child) {
  @apply mb-4;
}

.content h1 {
  @apply text-3xl font-bold;
}
.content h2 {
  @apply text-2xl font-bold;
}
.content h3 {
  @apply text-xl font-bold;
}
.content h4 {
  @apply text-lg font-bold;
}
.content h5 {
  @apply text-base font-bold;
}
</style>
