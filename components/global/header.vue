<script setup lang="ts">
import { computed, watchEffect, onMounted } from 'vue';
import BaseButton from '@/components/buttons/baseButton.vue';
import Icon from '@/components/icon/icon.vue';
import { useAsyncData } from 'nuxt/app';
import { useRoute } from 'vue-router';
const selectedItems = ref('');
const route = useRoute();
const { data: blog } = await useAsyncData(() => queryContent('blog').find());
const category = computed(() => route.params.category);
const latestPost = computed(() => {
  if (!blog.value) return null;
  return (blog.value as any[]).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
});

const searchInput = ref(false);
const searchValue = ref('');
const isFocused = ref(false);
const searchContainer = ref(null);

const handleFocus = () => {
  isFocused.value = true;
};

const handleClickOutside = (event: MouseEvent) => {
  if (
    searchContainer.value &&
    !(searchContainer.value as HTMLElement).contains(event.target as Node)
  ) {
    isFocused.value = false;
  }
};

const extractTextFromChildren = (children: any) => {
  let texts: any[] = [];
  children.forEach((child: any) => {
    if (child.props) {
      if (child.props.text) texts.push(child.props.text);
      if (child.props.id) texts.push(child.props.id);
    }
    if (child.children) {
      texts = texts.concat(extractTextFromChildren(child.children));
    }
  });
  console.log(texts);
  return texts;
};

const searchResult = computed(() => {
  if (!searchValue.value.trim()) return [];

  return (blog.value as any[]).filter((post: any) => {
    const textContent = post.body?.children
      ? extractTextFromChildren(post.body.children).join(' ')
      : '';
    return textContent.includes(searchValue.value.trim());
  });
});

watchEffect(() => {
  console.log(searchResult.value);
});

onMounted(() => {
  console.log(blog.value);
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

watchEffect(() => {
  let selectedText = 'home';

  const pathMappings: Record<string, string> = {
    '/': 'Home',
    '/blog/jsts': 'Jsts',
    '/blog/frontend': 'Frontend',
    '/blog/backend': 'Backend',
    '/blog/interactive': 'Interactive',
    '/blog/dsaCoding': 'DsaCoding',
    '/blog/projectExp': 'ProjectExp',
    '/blog/readings': 'Readings',
  };

  Object.keys(pathMappings).forEach((key) => {
    if (route.path.startsWith(key)) {
      selectedText = pathMappings[key];
    }
  });

  selectedItems.value = selectedText;
});
</script>

<template>
  <header class="header flex justify-between items-center">
    <div class="flex flex-col gap-2">
      <h2 class="text-[2rem] font-bold leading-[3rem]">
        {{ selectedItems }}
      </h2>
    </div>
    <div
      ref="searchContainer"
      class="header-search relative flex gap-2 bg-white border-2 border-gray-300"
      :class="{
        'search-active': searchInput,
        'rounded-[50%] justify-center items-center min-w-[3rem] h-[3rem]':
          !searchInput,
      }"
    >
      <BaseButton
        @click="searchInput = !searchInput"
        class="flex justify-center items-center"
      >
        <Icon icon="search" class="w-[1.5rem] h-[1.5rem]" />
      </BaseButton>
      <input
        v-if="searchInput"
        type="text"
        class="w-full outline-none"
        placeholder="Search"
        v-model="searchValue"
        @focus="handleFocus"
      />

      <div
        v-if="isFocused"
        class="absolute top-[3.5rem] left-0 flex flex-col gap-2 w-full bg-white min-h-[5rem] max-h-[10rem] z-10 shadow-md border-2 border-gray-300 rounded-md"
      >
        <div class="flex flex-col gap-2 p-2 border-b-2 border-gray-300">
          <NuxtLink :to="`/blog/${category}-${latestPost.slug}`">
            <div class="flex items-center gap-2">
              <div class="w-[1rem] h-[1rem]">
                <img
                  class="block w-full h-full"
                  :src="latestPost.image"
                  alt="profile"
                />
              </div>

              <div class="name">
                <span>{{ latestPost?.title }}</span>
                <div>
                  <span>{{ latestPost?.category }}</span>
                  <span>{{ latestPost?.date }}</span>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
        <div
          v-for="post in searchResult"
          :key="post.id"
          class="flex flex-col gap-2 p-2"
        >
          <NuxtLink :to="`/blog/${category}-${post.slug}`">
            <div class="flex items-center gap-2">
              <div class="w-[1rem] h-[1rem]">
                <img
                  class="block w-full h-full"
                  :src="post.image"
                  alt="profile"
                />
              </div>

              <div class="name">
                <span>{{ post.title }}</span>
                <div>
                  <span>{{ post.category }}</span>
                  <span>{{ post.date }}</span>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  transition: all 0.3s ease;
}

.search-active {
  justify-content: flex-start;
  min-width: 35rem;
  height: 3rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  background-color: white;
  padding: 0.5rem;
}

input:focus {
  outline: none;
}
</style>
