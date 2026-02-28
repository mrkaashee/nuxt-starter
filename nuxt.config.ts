// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxthub/core',
    '@nuxt/image',
    '@nuxt/hints',
    'nuxt-auth-utils',
  ],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  ui: {
    content: true,
    experimental: { componentDetection: true }
  },
  // future: { compatibilityVersion: 5 },
  experimental: {
    viteEnvironmentApi: true, typescriptPlugin: true, extractAsyncDataHandlers: true
  },
  compatibilityDate: '2026-02-25',
  hub: { db: 'sqlite' },
  eslint: { config: { stylistic: true } },
})
