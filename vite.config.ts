import { defineConfig } from "vite-plus"

export default defineConfig({
  // ── Formatting (Oxfmt - Rust-powered Prettier alternative) ──────────────────
  fmt: {
    // Basic code style
    semi: false,

    // Auto-format JSDoc comments & tags
    jsdoc: true,

    // File exclusions
    ignorePatterns: [
      "server/db/migrations/**",
      ".nuxt/**",
      ".output/**",
      "dist/**",
      "public/**",
      ".data/**",
    ],

    // Import sorting (Perfectionist-compatible)
    sortImports: {
      groups: [
        "builtin",
        "external",
        ["internal", "subpath"],
        ["parent", "sibling", "index"],
        "style",
        "unknown",
      ],
      internalPattern: ["~/", "~~/", "#", "#shared/**"],
    },

    // Sort package.json fields & scripts
    sortPackageJson: { sortScripts: true },

    // Tailwind CSS class sorting (Tailwind 4 & Nuxt UI helpers)
    sortTailwindcss: {
      attributes: ["class", "ui"],
      functions: ["clsx", "cn", "cva", "tw", "tv", "twMerge", "cx", "defineAppConfig"],
    },
  },

  // ── Linting (Oxlint & tsgolint) ─────────────────────────────────────────────
  lint: {
    ignorePatterns: [
      "server/db/migrations/**",
      ".nuxt/**",
      ".output/**",
      "dist/**",
      "public/**",
      "coverage/**",
    ],

    categories: {
      // correctness: "error",
      // // nursery: "warn",
      // pedantic: "warn",
      perf: "warn",
      // restriction: "warn",
      // style: "warn",
      // suspicious: "warn",
    },

    // // Active plugins
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],

    // Full type-aware linting powered by tsgolint
    options: { typeAware: true, typeCheck: true },

    rules: {
      "capitalized-comments": "off",
      curly: "off",
      // "no-console": ["warn", { allow: ["warn", "error"] }],
      // "no-debugger": "error",

      "vite-plus/prefer-vite-plus-imports": "error",
    },

    // Targeted exceptions per folder
    overrides: [
      {
        files: ["scripts/**", "server/db/seeds/**"],
        rules: {
          "no-console": "off",
        },
      },
      {
        files: ["tests/**", "**/*.test.ts", "**/*.spec.ts"],
        rules: {
          "@typescript-eslint/no-explicit-any": "off",
          "no-console": "off",
        },
      },
    ],
  },

  // ── Staged Git Hooks ───────────────────────────────────────────────────────
  staged: { "*": "vp check --fix" },
})
