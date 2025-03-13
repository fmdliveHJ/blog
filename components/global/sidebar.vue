<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref, watch, onMounted } from 'vue';

import BaseButton from '@/components/buttons/baseButton.vue';
import Icon from '@/components/icon/icon.vue';
import { useSidebarStore } from '@/store/sidebar';

const sidebarStore = useSidebarStore();

const { addSelectedItem } = sidebarStore;

const sideBarItem = [
  { name: 'Home', path: '/', content: 'Blog 메인 홈 입니다.' },
  { name: 'JSTS', path: '/blog/jsts', content: 'Blog 메인 홈 입니다.' }, // ✅ 변경
  { name: 'Frontend', path: '/blog/frontend', content: 'Blog 메인 홈 입니다.' }, // ✅ 변경
  { name: 'Backend', path: '/blog/backend', content: 'Blog 메인 홈 입니다.' }, // ✅ 변경
  {
    name: 'Interactive',
    path: '/blog/interactive',
    content: 'Blog 메인 홈 입니다.',
  }, // ✅ 변경
  {
    name: 'DSA Coding',
    path: '/blog/dsaCoding',
    content: 'Blog 메인 홈 입니다.',
  }, // ✅ 변경
  {
    name: 'Project Experience',
    path: '/blog/projectExp',
    content: 'Blog 메인 홈 입니다.',
  }, // ✅ 변경
  {
    name: 'Readings',
    path: '/blog/readings',
    content: 'Blog 메인 홈 입니다.',
  }, // ✅ 변경
];

const emit = defineEmits(['click']);

const route = useRoute();
const activeItem = ref<string | null>(null);

const getActiveItem = () => {
  return localStorage.getItem('activeItem') || null;
};

const handleClick = (item: any, event: any) => {
  emit('click', item, event);
  activeItem.value = item.path;
  localStorage.setItem('activeItem', item.path);
};

const isActive = (item: any) => {
  if (!activeItem.value) return false;
  if (item.path === '/') {
    return route.path === '/';
  }

  return route.path.startsWith(item.path);
};

onMounted(() => {
  activeItem.value = getActiveItem();
});

watch(
  () => route.path,
  (newPath) => {
    if (!newPath.startsWith(activeItem.value || '')) {
      activeItem.value = getActiveItem();
    }
  }
);

const slideActive = ref(true);

const sidebarToggle = () => {
  console.log('sidebarToggle');
  slideActive.value = !slideActive.value;
  console.log(slideActive.value);
};

const delayedSlideActive = ref(true);

watch(slideActive, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      delayedSlideActive.value = true;
    }, 200);
  } else {
    delayedSlideActive.value = false;
  }
});
</script>

<template>
  <div
    class="sidebar pt-10 bg-[var(--sidebar-bg-color)] transition-all duration-350"
    :class="{ 'sidebar-open': slideActive, 'sidebar-close': !slideActive }"
  >
    <div class="relative flex justify-between items-center px-[1rem]">
      <h1 class="text-3xl text-[var(--point-color)] font-bold">
        <NuxtLink
          v-if="delayedSlideActive"
          to="/"
          class="flex items-center h-[3rem]"
        >
          JHJ's BLOG
        </NuxtLink>
        <NuxtLink
          v-else
          to="/"
          class="flex justify-center items-center w-[3rem] h-[3rem] bg-[var(--sub-point-color)] rounded-[0.5rem]"
        >
          B
        </NuxtLink>
      </h1>

      <BaseButton
        class="flex justify-center items-center w-[2rem] h-[2rem] bg-[var(--sub-point-color)] rounded-[0.5rem] cursor-pointer"
        @click="sidebarToggle"
        :class="{ 'rotate-180 absolute right-[-1.5rem]': !slideActive }"
      >
        <Icon icon="arrowLeft" class="w-[1.5rem] h-[1.5rem]" />
      </BaseButton>
    </div>
    <div
      class="sidebar-list mt-[2rem]"
      :class="{
        'ml-[0.5rem] mr-[0.5rem]': !slideActive,
        'mr-[1rem]': slideActive,
      }"
    >
      <div
        v-for="item in sideBarItem"
        :key="item.name"
        class="rounded-[0.5rem] overflow-hidden"
      >
        <NuxtLink
          :to="item.path"
          class="flex w-full p-[1rem] gap-3"
          :class="{
            'bg-[var(--sub-point-color)]': isActive(item),
            'justify-center': !slideActive,
          }"
          @click="handleClick(item, $event)"
        >
          <Icon icon="search" class="w-[1.5rem] h-[1.5rem]" />
          <span
            class="sidebar-item"
            :class="{ 'w-[0rem] opacity-0 absolute': !delayedSlideActive }"
          >
            {{ item.name }}
          </span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar-open {
  min-width: var(--sidebar-width);
}

.sidebar-close {
  min-width: 5rem;
}
</style>
