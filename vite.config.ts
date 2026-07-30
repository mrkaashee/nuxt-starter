import { defineConfig } from "vite-plus"

export default defineConfig({
  fmt: {
    semi: false,
    sortImports: {
      groups: [
        "builtin",
        "external",
        ["internal", "subpath"],
        ["parent", "sibling", "index"],
        "style",
        "unknown",
      ],
      internalPattern: ["~/", "~~/", "#"],
    },
    sortPackageJson: {
      sortScripts: true,
    },
    sortTailwindcss: {
      attributes: ["class", "ui"],
      functions: ["clsx", "cn", "cva", "tw", "defineAppConfig"],
    },
    trailingComma: "all",
  },
  lint: {
    categories: {
      correctness: "error",
      // nursery: "warn",
      pedantic: "warn",
      perf: "warn",
      restriction: "warn",
      style: "warn",
      suspicious: "warn",
    },
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    options: { typeAware: true, typeCheck: true },
    rules: {
      "capitalized-comments": "off",
      curly: "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "vite-plus/prefer-vite-plus-imports": "error",
    },
  },
  staged: {
    "*": "vp check --fix",
  },
})
