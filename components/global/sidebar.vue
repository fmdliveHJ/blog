<script setup lang="ts">
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
];

const emit = defineEmits(['click']);

const handleClick = (item: any, event: any) => {
  emit('click', item, event);
};
</script>

<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h1>JSTS</h1>
    </div>
    <div class="sidebar-list">
      <div v-for="item in sideBarItem" :key="item.name">
        <NuxtLink
          :to="item.path"
          class="sidebar-link"
          @click="handleClick(item, $event)"
        >
          <div class="sidebar-item">{{ item.name }}</div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar-link {
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px;
}
</style>
