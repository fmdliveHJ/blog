// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/content'],
  content: {},
  compatibilityDate: '2025-03-17',
  css: ['~/assets/styles/main.css'],
  nitro: {
    publicAssets: [
      {
        dir: 'public',
        baseURL: '/',
      },
    ],
  },
});
