import pkg from "./package.json"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2026-08-20",
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true, timeline: { enabled: true } },
  experimental: {
    defaults: { nuxtLink: { trailingSlash: "remove" } },
    extractAsyncDataHandlers: true,
    prefetchPreloadTags: true,
    typedPages: true,
    typescriptPlugin: true,
    viteEnvironmentApi: true,
    watcher: "builder",
    writeEarlyHints: true,
  },
  runtimeConfig: { public: { version: pkg.version } },
  modules: ["@nuxt/ui", "@nuxthub/core", "@nuxt/hints"],
  tracingChannel: true,
})
