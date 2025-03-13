import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: true,
  modules: ['@nuxt/content', '@pinia/nuxt'],
  css: ['~/assets/styles/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
});
