import pkg from "./package.json" with { type: "json" }

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2026-10-10",
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

    routeTypedFetch: true,
  },
  runtimeConfig: { public: { version: pkg.version } },

  vue: { vapor: true },
  modules: ["@nuxt/ui", "@nuxthub/core"],
  tracingChannel: true,
})
