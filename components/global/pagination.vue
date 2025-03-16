<script setup lang="ts">
const props = defineProps({
  total: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    required: true,
  },
  pageGroup: {
    type: Number,
    default: 5,
  },
});

const emit = defineEmits(['update:currentPage']);

const totalPages = computed(() => {
  return Math.ceil(props.total / props.pageSize);
});

const currentGroup = computed(() =>
  Math.ceil(props.currentPage / props.pageGroup)
);

// 그룹의 첫 번째 페이지
const startPage = computed(
  () => (currentGroup.value - 1) * props.pageGroup + 1
);

// 그룹의 마지막 페이지 (총 페이지 수 초과 방지)
const endPage = computed(() =>
  Math.min(startPage.value + props.pageGroup - 1, totalPages.value)
);
const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('update:currentPage', page);
  }
};

const isFirstPage = computed(() => {
  return props.currentPage === 1;
});

const isLastPage = computed(() => {
  return props.currentPage === totalPages.value;
});
</script>

<template>
  <nav class="flex gap-[0.5rem] items-center justify-center">
    <button
      :disabled="isFirstPage"
      @click="changePage(startPage - 1)"
      class="cursor-pointer"
    >
      <Icon icon="search" class="w-[1.5rem] h-[1.5rem]" />
    </button>

    <span v-for="page in endPage - startPage + 1" :key="startPage + page - 1">
      <button
        class="cursor-pointer px-2 py-1 rounded"
        :class="{ 'bg-black text-white': startPage + page - 1 === currentPage }"
        @click="changePage(startPage + page - 1)"
      >
        {{ startPage + page - 1 }}
      </button>
    </span>

    <button
      :disabled="isLastPage"
      @click="changePage(endPage + 1)"
      class="cursor-pointer"
    >
      <Icon icon="search" class="w-[1.5rem] h-[1.5rem]" />
    </button>
  </nav>
</template>

<style scoped>
.active {
  background-color: #000;
  color: #fff;
}
</style>
