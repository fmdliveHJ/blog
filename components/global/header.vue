<script setup lang="ts">
import { computed, watchEffect, onMounted, onUnmounted } from 'vue';
import BaseButton from '@/components/buttons/baseButton.vue';
import Icon from '@/components/icon/icon.vue';
import { useAsyncData } from 'nuxt/app';
import { useRoute } from 'vue-router';

const route = useRoute();
const selectedItems = ref('');
const { data: blog } = await useAsyncData(() => queryContent('blog').find());

const postList = computed(() => {
  if (!blog.value) return [];
  return (blog.value as any[]).map((post: any) => ({
    ...post,
    slug: post.path.split('/').pop() || '',
  }));
});

const latestPost = computed(() => {
  if (!postList.value.length) return null;
  return [...postList.value].sort(
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

const extractTextOnly = (children: any) => {
  let texts: string[] = [];

  children.forEach((child: any) => {
    if (child.type === 'text') {
      texts.push(child.value);
    } else if (
      child.type === 'element' &&
      child.tag !== 'pre' &&
      child.tag !== 'code'
    ) {
      if (child.children) texts = texts.concat(extractTextOnly(child.children));
    }
  });

  return texts.join(' ');
};

const blogContent = computed(() => {
  if (!blog.value) return [];

  return blog.value.map((post: any) => {
    return {
      title: post.title,
      category: post.category,
      date: post.date,
      description: post.description,
      slug: post.path.split('/').pop() || '',
      content: extractTextOnly(post.body.children),
    };
  });
});

const windowWidth = ref(0);

// 1024px 이하일 때 searchInput을 자동 활성화
const isSearchActive = computed(() => {
  searchInput.value = true;
  return searchInput.value || windowWidth.value <= 1024;
});

// 창 크기 변경 시 업데이트
const updateSearchState = () => {
  windowWidth.value = window.innerWidth;
};

// 컴포넌트가 마운트될 때 이벤트 추가
onMounted(() => {
  windowWidth.value = window.innerWidth; // 초기값 설정
  window.addEventListener('resize', updateSearchState);
});

// 컴포넌트가 언마운트될 때 이벤트 제거
onUnmounted(() => {
  window.removeEventListener('resize', updateSearchState);
});

const searchResult = computed(() => {
  if (!searchValue.value.trim()) return [];

  const query = searchValue.value.trim().toLowerCase();

  return blogContent.value.filter((post: any) => {
    const searchableText = [
      post.title,
      post.category,
      post.date,
      post.description,
      post.content,
    ]
      .join(' ')
      .toLowerCase();

    return searchableText.includes(query);
  });
});

onMounted(() => {
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
  <header
    class="header flex-col md:flex-row w-full max-w-[1200px] flex justify-between items-start md:items-center gap-2 md:gap-0"
  >
    <div class="flex flex-col gap-2">
      <h2
        class="text-[1.5rem] md:text-[2rem] font-medium leading-[3rem] font-outfit"
      >
        {{ selectedItems }}
      </h2>
    </div>
    <div
      ref="searchContainer"
      class="header-search relative flex gap-2 bg-white border-2 border-gray-300"
      :class="{
        'search-active': isSearchActive,
        'rounded-[50%] justify-center items-center min-w-[3rem] h-[3rem]':
          !searchInput,
      }"
    >
      <BaseButton
        @click="(searchInput = !searchInput), (isFocused = false)"
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
          <NuxtLink
            :to="`/blog/${latestPost.category}-${latestPost.slug}`"
            @click="isFocused = false"
          >
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
          v-if="searchResult.length > 0"
          class="flex flex-col gap-2 p-2 overflow-y-auto max-h-[10rem]"
        >
          <div v-for="post in searchResult" :key="post.id">
            <NuxtLink
              :to="`/blog/${post.category}-${post.slug}`"
              @click="isFocused = false"
            >
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

        <div v-else class="flex flex-col gap-2 p-2">
          <span>No results found</span>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  transition: all 0.3s ease;
}
/* .header-search {
  @media (max-width: 768px) {
    width: 100%;
    border-radius: 0.5rem;
    justify-content: flex-start;
    padding: 0.5rem;  
  }
} */

.search-active {
  justify-content: flex-start;
  min-width: 35rem;
  height: 3rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  background-color: white;
  padding: 0.5rem;
  @media (max-width: 1024px) {
    min-width: 20rem;
  }
  @media (max-width: 768px) {
    transition: all 0.1s ease;
    min-width: 100%;
  }
}

input:focus {
  outline: none;
}
</style>
