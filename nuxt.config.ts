// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxthub/core"],
  css: ["~/assets/css/main.css"],
  compatibilityDate: "2026-07-12",
  devtools: { enabled: true, timeline: { enabled: true } },
  experimental: {
    typedPages: true,
    writeEarlyHints: true,
    defaults: { nuxtLink: { trailingSlash: "remove" } },
    viteEnvironmentApi: true,
    typescriptPlugin: true,
    extractAsyncDataHandlers: true,
  },
})
