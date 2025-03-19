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
  <div class="content min-h-[50%] bg-white p-[1rem] md:p-[2rem] rounded-[1rem]">
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
  @apply text-xl md:text-3xl font-bold;
}
.content h2 {
  @apply text-lg md:text-2xl font-bold;
}
.content h3 {
  @apply text-lg md:text-2xl font-bold;
}
.content h4 {
  @apply text-lg md:text-xl font-bold;
}
.content h5 {
  @apply text-base md:text-lg font-bold;
}
</style>
