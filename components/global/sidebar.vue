<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, watch, onMounted, inject } from 'vue';
import BaseButton from '@/components/buttons/baseButton.vue';
import Icon from '@/components/icon/icon.vue';

const emit = defineEmits(['click']);
const route = useRoute();
const activeItem = ref<string | null>(null);

const slideActive = ref(true);
const delayedSlideActive = ref(true);

const rawCategoryCounts = inject(
  'categoryCounts',
  ref<Record<string, number>>({})
);

const sideBarItem = [
  { name: 'Home', path: '/', abbreviation: 'H' },
  { name: 'JSTS', path: '/blog/jsts', abbreviation: 'Js' },
  { name: 'Frontend', path: '/blog/frontend', abbreviation: 'Fe' },
  { name: 'Backend', path: '/blog/backend', abbreviation: 'Be' },
  { name: 'Interactive', path: '/blog/interactive', abbreviation: 'Ix' },
  { name: 'DSA Coding', path: '/blog/dsaCoding', abbreviation: 'DSA' },
  {
    name: 'Project Experience',
    path: '/blog/ProjectExperience',
    abbreviation: 'P.E',
  },
  { name: 'Books', path: '/blog/books', abbreviation: 'Bks' },
];

const categoryCounts = computed(() => {
  const normalizedCounts: Record<string, number> = {};
  for (const key in rawCategoryCounts.value) {
    normalizedCounts[key.toLowerCase()] = rawCategoryCounts.value[key];
  }
  return normalizedCounts;
});

onMounted(() => {
  console.log(categoryCounts.value);
});

interface SidebarItem {
  name: string;
  path: string;
}

const filteredSideBarItems = ref<SidebarItem[]>([]);

watchEffect(() => {
  filteredSideBarItems.value = sideBarItem.filter((item) => {
    return (
      item.name === 'Home' ||
      categoryCounts.value[item.name.replace(/\s/g, '').toLowerCase()] !==
        undefined
    );
  });
});

const getActiveItem = () => {
  if (process.client) {
    return localStorage.getItem('activeItem') || null;
  }
  return null;
};

const handleClick = (item: any, event: any) => {
  emit('click', item, event);
  activeItem.value = item.path;
  if (process.client) {
    localStorage.setItem('activeItem', item.path);
  }
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

const sidebarToggle = () => {
  slideActive.value = !slideActive.value;
};

watch(slideActive, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      delayedSlideActive.value = true;
    }, 100);
  } else {
    delayedSlideActive.value = false;
  }
});

function defineEmits(arg0: 'click'[]) {
  throw new Error('Function not implemented.');
}
</script>

<template>
  <div
    class="sidebar relative pt-10 bg-[var(--sidebar-bg-color)] transition-all duration-350"
    :class="{ 'sidebar-open': slideActive, 'sidebar-close': !slideActive }"
  >
    <div class="relative flex justify-between items-center px-[1rem]">
      <h1 class="text-3xl text-[var(--point-color)] font-bold">
        <NuxtLink
          v-if="delayedSlideActive"
          to="/"
          class="flex items-center h-[3rem]"
          ><span class="relative top-[3px]flex items-center font-outfit">
            JHJ's BLOG
          </span>
        </NuxtLink>
        <NuxtLink
          v-else
          to="/"
          class="flex justify-center items-center w-[3rem] h-[3rem] bg-[var(--sub-point-color)] rounded-[0.5rem] hidden md:flex font-outfit"
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
        'ml-[1rem] mr-[1rem]': !slideActive,
        'mr-[1rem]': slideActive,
      }"
    >
      <div
        v-for="item in filteredSideBarItems"
        :key="item.name"
        class="overflow-hidden"
      >
        <NuxtLink
          :to="item.path"
          class="relative flex w-full h-[3rem] gap-3 font-noto-sans-display"
          :class="{
            'bg-[var(--sub-point-color)] overflow-hidden': isActive(item),
            'justify-center rounded-[0.5rem] rounded-l-[0.5rem] rounded-bl-[0.5rem]':
              !slideActive,
            'rounded-[0.5rem] rounded-l-none rounded-bl-none overflow-hidden':
              slideActive,
          }"
          @click="handleClick(item, $event)"
        >
          <span
            v-if="slideActive"
            class="sidebar-item flex items-center font-medium pl-[1rem] font-outfit"
            :class="{ 'w-[0rem] opacity-0 absolute': !delayedSlideActive }"
          >
            {{ item.name }}
          </span>
          <span
            v-else
            class="sidebar-item flex items-center font-medium text-[0.8rem] md:text-[1rem] font-outfit"
          >
            {{ item.abbreviation }}
          </span>
          <span
            v-if="categoryCounts[item.name.replace(/\s/g, '').toLowerCase()]"
            :class="
              slideActive
                ? 'text-[0.8rem] absolute right-[1rem] top-[50%] translate-y-[-50%] font-outfit'
                : 'hidden'
            "
          >
            {{ categoryCounts[item.name.replace(/\s/g, '').toLowerCase()] }}
          </span>
        </NuxtLink>
      </div>
    </div>
    <div class="absolute bottom-[1rem] left-[1rem]">
      <div class="email h-[2rem] flex items-center">
        <NuxtLink
          to="mailto:gdalove@naver.com"
          target="_blank"
          class="flex gap-[0.5rem] items-center sidebar-item font-medium font-outfit"
        >
          <Icon icon="email" class="w-[1.5rem] h-[1.5rem]" />
          <span>gdlove@naver.com</span>
        </NuxtLink>
      </div>
      <div class="h-[2rem] flex items-center">
        <NuxtLink
          to="https://github.com/fmdliveHJ"
          target="_blank"
          class="flex gap-[0.5rem] items-center sidebar-item font-medium font-outfit"
        >
          <Icon icon="github" class="w-[1.5rem] h-[1.5rem]" />
          <span>github</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar-open {
  min-width: var(--sidebar-width);
  @media (max-width: 1280px) {
    min-width: 280px;
  }
  @media (max-width: 1024px) {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
  }
}

.sidebar-close {
  min-width: 5rem;
  @media (max-width: 1024px) {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    min-width: 280px;
    transform: translateX(-100%);
  }
}
</style>
