// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxthub/core", "@nuxt/hints"],
  css: ["~/assets/css/main.css"],
  compatibilityDate: "2026-07-20",
  devtools: { enabled: true, timeline: { enabled: true } },

  tracingChannel: true,
  experimental: {
    prefetchPreloadTags: true,
    watcher: "builder",
    typedPages: true,
    writeEarlyHints: true,
    defaults: { nuxtLink: { trailingSlash: "remove" } },
    viteEnvironmentApi: true,
    typescriptPlugin: true,
    extractAsyncDataHandlers: true,
  },
})
