<script setup lang="ts">
import '../assets/styles/main.scss';
import Sidebar from '../components/global/sidebar.vue';
import Header from '../components/global/header.vue';
</script>

<template>
  <div id="layout" class="flex">
    <Sidebar />
    <div class="page-container">
      <Header />
      <main>
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
#layout {
  height: 100vh;
}
</style>
