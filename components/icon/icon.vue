<script setup lang="ts">
import { computed } from 'vue';
import arrowIconLeft from 'assets/images/icon/icon_arrow_left.svg';
import arrowIconLeftPagination from 'assets/images/icon/icon_arrow_left_pagination.svg';
import searchIcon from 'assets/images/icon/icon_search.svg';
import IconDoc from 'assets/images/icon/icon_doc.svg';
import emailIcon from 'assets/images/icon/icon_email.svg';
import githubIcon from 'assets/images/icon/icon_github.svg';

const iconMap: Record<string, string> = {
  search: searchIcon,
  arrowLeft: arrowIconLeft,
  doc: IconDoc,
  arrowLeftPagination: arrowIconLeftPagination,
  email: emailIcon,
  github: githubIcon,
};

const props = defineProps<{ icon?: string }>();

const imgSrc = computed(() => {
  if (!props.icon) return '';
  return iconMap[props.icon] || '';
});
</script>

<template>
  <img v-if="imgSrc" :src="imgSrc" :alt="props.icon" />
</template>
