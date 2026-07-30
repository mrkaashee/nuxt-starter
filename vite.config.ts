import { defineConfig } from "vite-plus"

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {
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
    sortPackageJson: {
      sortScripts: true,
    },
  },
  lint: {
    categories: {
      // correctness: "error",
      // nursery: "warn",
      // pedantic: "warn",
      // perf: "warn",
      // restriction: "warn",
      // style: "warn",
      // suspicious: "warn",
    },
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: {
      "capitalized-comments": "off",
      curly: "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "vite-plus/prefer-vite-plus-imports": "error",
    },
    options: { typeAware: true, typeCheck: true },
  },
})
