// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxthub/core"],
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  compatibilityDate: "2025-07-15",

  $development: {},
  hub: {
    db: { dialect: "sqlite", casing: "snake_case" },
    // kv: {},
    // cache: {},
    // blob: {},
  },
})
