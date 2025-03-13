<script setup lang="ts">
import { computed, watchEffect, onMounted } from 'vue';
import BaseButton from '@/components/buttons/baseButton.vue';
import Icon from '@/components/icon/icon.vue';

const selectedItems = ref('');
const route = useRoute();

watchEffect(() => {
  console.log('🔍 route.path:', route.path);

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
    <div class="header-search">
      <BaseButton>
        <Icon icon="search" class="w-[1.5rem] h-[1.5rem]" />
      </BaseButton>
    </div>
  </header>
</template>

<style scoped></style>
