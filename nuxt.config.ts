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
  $production: {
    nitro: {
      preset: 'cloudflare_module',
      cloudflare: {
        deployConfig: true, nodeCompat: true,
        wrangler: { observability: { enabled: true } }
      }
    },
    hub: {
      db: {
        dialect: 'sqlite',
        driver: 'd1',
        connection: { databaseId: process.env.DATABASE_ID }
      },
    }
  },

  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  ui: {
    content: true,
    experimental: { componentDetection: true }
  },
  // future: { compatibilityVersion: 5 },
  experimental: {
    typedPages: true, writeEarlyHints: true,
    defaults: { nuxtLink: { trailingSlash: 'remove' } },
    viteEnvironmentApi: true, typescriptPlugin: true, extractAsyncDataHandlers: true
  },
  compatibilityDate: '2026-03-04',

  hub: { db: 'sqlite' },

  eslint: { config: { stylistic: true } },
})
