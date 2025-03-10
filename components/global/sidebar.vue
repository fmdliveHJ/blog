<script setup lang="ts">
const sideBarItem = [
  { name: 'Home', path: '/' },
  { name: 'JSTS', path: '/blog/jsts' }, // ✅ 변경
  { name: 'Frontend', path: '/blog/frontend' }, // ✅ 변경
  { name: 'Backend', path: '/blog/backend' }, // ✅ 변경
  { name: 'Interactive', path: '/blog/interactive' }, // ✅ 변경
  { name: 'DSA Coding', path: '/blog/dsa-coding' }, // ✅ 변경
  { name: 'Project Experience', path: '/blog/project-exp' }, // ✅ 변경
];
</script>

<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h1>JSTS</h1>
    </div>
    <div class="sidebar-list">
      <div v-for="item in sideBarItem" :key="item.name">
        <NuxtLink :to="item.path" class="sidebar-link">
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
