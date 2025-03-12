<script setup lang="ts">
import { computed } from 'vue';
import arrowIconLeft from '../../assets/images/icon/icon_arrow_left.svg';
import searchIcon from '../../assets/images/icon/icon_search.svg';

const iconMap: Record<string, string> = {
  search: searchIcon,
  arrowLeft: arrowIconLeft,
};

const props = defineProps<{ icon?: string }>();

const imgSrc = computed(() => {
  if (!props.icon) return '';
  return iconMap[props.icon] || '';
});
</script>

<template>
  <img v-if="imgSrc" :src="imgSrc" :alt="icon" />
</template>
