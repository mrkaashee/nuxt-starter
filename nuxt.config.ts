// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/hints", "@nuxt/ui", "@nuxthub/core", "nuxt-auth-utils"],
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  compatibilityDate: "2025-07-15",
  hub: { db: { dialect: "sqlite", casing: "snake_case" } },
  runtimeConfig: {
    sendgridApiKey: "",
    sendgridFromEmail: "",
  },
})
