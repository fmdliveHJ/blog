<script setup lang="ts">
import { computed, watchEffect } from 'vue';

const props = defineProps<{
  sideBarItem: { name: string; path: string; content: string } | null;
}>();

const sideBarItem = computed(() => props.sideBarItem);

watchEffect(() => {
  console.log(props);
  console.log(sideBarItem.value);
});
</script>

<template>
  <header>
    <div class="header-content">
      <h1>{{ sideBarItem?.name }}</h1>
      <div>{{ sideBarItem?.content }}</div>
    </div>
    <div class="header-search">
      <input type="text" placeholder="Search" />
    </div>
  </header>
</template>

<style scoped></style>
