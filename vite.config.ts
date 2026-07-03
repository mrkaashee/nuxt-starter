import { defineConfig } from "vite-plus"

export default defineConfig({
  staged: {
    "*.{vue,ts,tsx,js,jsx}": "vp check --fix",
  },
  fmt: {
    exclude: ["server/db/migrations/**"],
    semi: false,
    trailingComma: "all",
    sortImports: {
      internalPattern: ["~/", "~~/", "#"],
      groups: [
        "builtin",
        "external",
        ["internal", "subpath"],
        ["parent", "sibling", "index"],
        "style",
        "unknown",
      ],
    },
    sortTailwindcss: {
      attributes: ["class", "ui"],
      functions: ["clsx", "cn", "cva", "tw", "defineAppConfig"],
    },
  },
  lint: {
    options: { typeAware: true, typeCheck: true },
    ignorePatterns: ["server/db/migrations/**"],
  },
})
