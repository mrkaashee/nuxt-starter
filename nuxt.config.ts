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
      // D1 database
      db: {
        dialect: 'sqlite',
        driver: 'd1',
        connection: { databaseId: process.env.DATABASE_ID }
      },
      // KV namespace (binding defaults to 'KV')
      kv: {
        driver: 'cloudflare-kv-binding',
        namespaceId: process.env.KV_ID
      },
      // Cache KV namespace (binding defaults to 'CACHE')
      cache: {
        driver: 'cloudflare-kv-binding',
        namespaceId: process.env.KV_ID
      },
      // R2 bucket (binding defaults to 'BLOB')
      blob: {
        driver: 'cloudflare-r2',
        bucketName: process.env.BLOB_NAME
      }
    }
  },

  devtools: { enabled: true, timeline: { enabled: true } },
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
  hub: { db: 'sqlite', kv: true, cache: true, blob: true },
  eslint: { config: { stylistic: true } },
})
