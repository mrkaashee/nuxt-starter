// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/hints',
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxthub/core',
    'nuxt-auth-utils',
  ],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-07-15',
  hub: { db: 'sqlite' },
  eslint: { config: { stylistic: true } },
  runtimeConfig: {
    sendgridApiKey: '',
    sendgridFromEmail: '',
  },
})
