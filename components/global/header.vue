<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import BaseButton from '@/components/buttons/baseButton.vue';
import Icon from '@/components/icon/icon.vue';
const props = defineProps<{
  sideBarItem: { name: string; path: string; content: string } | null;
}>();

const sideBarItem = computed(() => props.sideBarItem);
</script>

<template>
  <header class="header flex justify-between items-center">
    <div class="">
      <h1>{{ sideBarItem?.name }}</h1>
      <div>{{ sideBarItem?.content }}</div>
    </div>
    <div class="header-search">
      <BaseButton>
        <Icon icon="search" class="w-[1.5rem] h-[1.5rem]" />
      </BaseButton>
    </div>
  </header>
</template>

<style scoped></style>
