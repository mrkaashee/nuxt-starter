<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

---

<!--NUXT START-->

# Project Coding Conventions

These rules apply to every AI agent, every developer, and every code change in this
repository. No exceptions unless explicitly noted.

---

## 1. Vue Event Handlers — Always Use Arrow Functions

Never bind functions directly in Vue event directives. Always wrap in an arrow function.

```vue
<!-- ✅ Correct -->
@click="() => someFunc()" @click="() => someFunc(arg)" @change="(e) => handleChange(e)"
@update:modelValue="(v) => emit('update:modelValue', v)" @submit="(e) => handleSubmit(e)" @blur="()
=> validate()"

<!-- ❌ Wrong -->
@click="someFunc" @click="someFunc()" @change="handleChange($event)" @submit="handleSubmit"
```

Applies to all Vue event directives: `@click`, `@submit`, `@change`, `@input`,
`@keyup`, `@keydown`, `@blur`, `@focus`, `@update:modelValue`, and all others.
Applies to every `.vue` file without exception.

---

## 7. Layouts & Pages — Structure Rules

Every layout and page must follow this exact structure. No exceptions.

### `app.vue` — Root Shell

`app.vue` is the single root shell. It must only contain `UApp`, the loading indicator,
the route announcer, and the layout/page wrappers. No business logic here.

```vue
<template>
  <UApp>
    <NuxtLoadingIndicator />
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
```

### Standard Layouts — `layouts/[name].vue`

A standard layout (marketing, public portal, auth) wraps its content in a header + slot.
No business logic in layouts — only structural components.

```vue
<!-- ✅ Correct — layouts/default.vue, layouts/public.vue, etc. -->
<template>
  <AppHeader />
  <slot />
  <AppFooter />
</template>
```

### Dashboard Layout — `layouts/dashboard.vue` (or any sidebar layout)

Dashboard layouts use `UDashboardGroup` + `UDashboardSidebar` + slot. The sidebar
component handles navigation — the layout itself stays thin.

```vue
<!-- ✅ Correct -->
<template>
  <UDashboardGroup>
    <UDashboardSidebar>
      <!-- sidebar nav content -->
    </UDashboardSidebar>
    <slot />
  </UDashboardGroup>
</template>
```

### Normal Pages — `pages/**/*.vue`

Standard (non-dashboard) pages use `UMain` as the page root. `UContainer` is optional
and accepts padding classes. Always use `UMain` — never a bare `<div>`.

```vue
<!-- ✅ Correct -->
<template>
  <UMain>
    <UContainer class="p-4 sm:p-6 lg:p-8">
      <!-- page content -->
    </UContainer>
  </UMain>
</template>

<!-- ✅ Also correct — UContainer is optional -->
<template>
  <UMain>
    <!-- full-width content -->
  </UMain>
</template>

<!-- ❌ Wrong -->
<template>
  <div class="mx-auto max-w-7xl px-4">...</div>
</template>
```

### Dashboard Pages — `pages/[handle]/[vertical]/**/*.vue`

Dashboard pages (inside a `UDashboardGroup` layout) must use `UDashboardPanel` as
the page root. `UModal` must live **outside** `UDashboardPanel`, as a sibling at the
template root.

```vue
<!-- ✅ Correct -->
<template>
  <UDashboardPanel>
    <template #header>
      <!-- page title, action buttons -->
    </template>
    <template #body>
      <!-- main content -->
    </template>
  </UDashboardPanel>

  <!-- UModal is ALWAYS outside UDashboardPanel -->
  <UModal v-model:open="isModalOpen">
    <!-- modal content -->
  </UModal>
</template>

<!-- ❌ Wrong — modal nested inside panel -->
<template>
  <UDashboardPanel>
    <template #body>
      <UModal v-model:open="isOpen">...</UModal>
    </template>
  </UDashboardPanel>
</template>
```

### Nested Page Groups — Layout Inheritance

For nested route groups (e.g. `pages/orders/`, `pages/store/`), create a parent page
at the same level that sets the layout and renders `<NuxtPage />`. Child pages in the
folder then inherit the layout automatically without repeating `definePageMeta`.

```
pages/
  orders.vue          ← sets layout, renders <NuxtPage />
  orders/
    index.vue         ← no definePageMeta needed
    [id].vue          ← no definePageMeta needed
    new.vue           ← no definePageMeta needed
```

```vue
<!-- pages/orders.vue — layout wrapper -->
<script setup lang="ts">
definePageMeta({ layout: "dashboard" })
</script>

<template>
  <NuxtPage />
</template>
```

```vue
<!-- pages/orders/index.vue — just content, no layout needed -->
<template>
  <UDashboardPanel>
    <template #header>Orders</template>
    <template #body>...</template>
  </UDashboardPanel>
</template>
```

Individual child pages can still override the layout with their own `definePageMeta`
if needed.

### `UCard` — Use for Bordered / Rounded Containers

Never use raw `<div>` with manual border and radius classes for card-like containers.
Always use `UCard`.

```vue
<!-- ✅ Correct -->
<UCard>
  <p>Card content</p>
</UCard>

<UCard class="p-2">
  <!-- custom padding via class -->
</UCard>

<!-- ❌ Wrong -->
<div class="border-default bg-elevated rounded-lg border p-4">...</div>
<div class="ring-muted rounded-xl p-6 shadow ring-1">...</div>
```

---

## 8. Authentication — `nuxt-auth-utils`

This project uses `nuxt-auth-utils` for session management. Always use its built-in
composables and server utilities. Never implement custom session logic.

### Client-side (Vue components / composables)

```typescript
// ✅ Correct — composables are auto-imported
const { loggedIn, user, session, clear } = useUserSession()

// Check auth state
if (!loggedIn.value) navigateTo("/login")

// Access user
console.log(user.value?.id)

// Log out
await clear()
```

### Server-side (API route handlers)

> **Nuxt 4.6+ note:** A new `nuxt/server` import surface exists for portable server code.
> The current project uses auto-imported h3 helpers (still fully supported).
>
> **⛔ Migration currently blocked** — `nuxt-auth-utils` (`setUserSession`, `requireUserSession`,
> `getUserSession`) still expects `H3Event` internally. Passing `RequestEvent` from `nuxt/server`
> causes a type mismatch. Wait until `nuxt-auth-utils` ships `RequestEvent` support before migrating.
>
> **Do NOT attempt this migration yet.** Keep using auto-imported h3 helpers everywhere.
>
> For reference when migration becomes unblocked, `nuxt/server` exports:
> `defineEventHandler`, `createError`, `getQuery`, `getValidatedQuery`, `getRequestHeader`,
> `getRequestHost`, `getRequestIP`, `getRequestURL`, `getRouterParam`, `getRouterParams`,
> `readBody`, `readValidatedBody`, `getCookie`, `setCookie`, `sendRedirect`, `setResponseStatus`,
> `handleCors`, `useRuntimeConfig` — plus `type RequestEvent` (replaces `H3Event`).
> Note: `getHeader` → `getRequestHeader`, `setResponseHeader` → `event.res.headers.set(...)`

```typescript
// ✅ Correct — server utils are auto-imported in H3 handlers
export default defineEventHandler(async (event) => {
  // Require auth — throws 401 if not logged in
  const { user } = await requireUserSession(event)

  // Or get session without throwing
  const session = await getUserSession(event)
  if (!session.user) return null

  // Set session (on login)
  await setUserSession(event, { user: { id: "...", email: "..." } })

  // Clear session (on logout)
  await clearUserSession(event)
})
```

```typescript
// ❌ Wrong — never implement custom JWT/cookie session logic
const token = getCookie(event, "auth_token")
const payload = jwt.verify(token, secret)
```

---

## 12. Auto-Imports & Import Rules

Understanding what is auto-imported vs what must be explicitly imported prevents
hard-to-debug errors — especially in schema files where the build context differs.

### Path Aliases

Nuxt generates these TypeScript path aliases (from `.nuxt/tsconfig.json`):

| Alias       | Resolves to  | Use when                                                      |
| ----------- | ------------ | ------------------------------------------------------------- |
| `#shared`   | `./shared/`  | Explicit import from shared layer                             |
| `#shared/*` | `./shared/*` | e.g. `import type { OrgModule } from '#shared/types/modules'` |
| `#server`   | `./server/`  | Explicit import from server layer                             |
| `#server/*` | `./server/*` | Rarely needed — server auto-imports cover most cases          |
| `~/`        | `./app/`     | Vue components, composables, pages                            |
| `~~/`       | project root | Avoid — use `#shared` or `#server` instead                    |

**In most cases you won't need these** — Nuxt/Nitro auto-imports everything.
Use `#shared/*` only in files that are outside the auto-import context
(test files, schema files, standalone scripts).

> If types seem missing after adding a new file to `shared/`, run `vp install`
> (triggers `nuxt prepare` via `postinstall`) to regenerate the auto-import manifest.

### Server context (`server/api/`, `server/utils/`, `server/middleware/`)

These are **auto-imported** — never import them manually in server files:

| Auto-imported                                                                                   | What it is                                                       |
| ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `db`                                                                                            | Drizzle database instance (NuxtHub D1 binding)                   |
| `schema`                                                                                        | All Drizzle table exports merged into one object                 |
| `defineEventHandler`                                                                            | H3 route handler factory                                         |
| `readValidatedBody`                                                                             | H3 validated body reader                                         |
| `getValidatedRouterParams`                                                                      | H3 validated route params reader                                 |
| `createError`                                                                                   | H3 error factory                                                 |
| `requireUserSession`                                                                            | nuxt-auth-utils session guard                                    |
| `getUserSession`                                                                                | nuxt-auth-utils session getter                                   |
| `setUserSession`                                                                                | nuxt-auth-utils session setter                                   |
| `clearUserSession`                                                                              | nuxt-auth-utils session clear                                    |
| `eq`, `and`, `or`, `sql`, `desc`, `asc`, `count`, `inArray`, `isNull`, `gte`, `lte`, …          | Re-exported from `server/utils/drizzle.ts`                       |
| `zUuidLike`, `zHandleParam`, `zTextShort`, `zTextLong`, `zCurrencyMinor`, `paginationSchema`, … | From `server/utils/validation.ts` + `shared/utils/pagination.ts` |
| `hasModule`, `hasAllModules`, `hasAnyModule`, `enableModule`, `disableModule`                   | From `shared/utils/modules.ts`                                   |

```typescript
// ✅ Correct — use auto-imported names directly in server code
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const rows = await db
    .select()
    .from(schema.storeOrders)
    .where(and(eq(schema.storeOrders.orgId, user.orgId), isNull(schema.storeOrders.deletedAt)))
    .orderBy(desc(schema.storeOrders.createdAt))

  return rows
})

// ❌ Wrong — never import these manually in server files
import { eq, and } from "drizzle-orm" // auto-imported

import { db } from "#server/utils/drizzle" // auto-imported
import { hasModule } from "#shared/utils/modules" // auto-imported
```

### Client context (`app/composables/`, `app/components/`, `app/pages/`)

Vue composables, components, and pages also have auto-imports:

| Auto-imported                                          | What it is                                                 |
| ------------------------------------------------------ | ---------------------------------------------------------- |
| All `app/composables/use*.ts` exports                  | Project composables                                        |
| `ref`, `computed`, `reactive`, `watch`, `onMounted`, … | Vue 3 reactivity                                           |
| `useRoute`, `useRouter`, `navigateTo`                  | Vue Router / Nuxt navigation                               |
| `useFetch`, `useAsyncData`, `$fetch`                   | Nuxt data fetching                                         |
| `useUserSession`, `useNuxtApp`                         | Auth + app context                                         |
| All VueUse composables via `@vueuse/nuxt`              | `useLocalStorage`, `useClipboard`, `until`, …              |
| `hasModule`, `hasAllModules`, `hasAnyModule`           | From `shared/utils/modules.ts`                             |
| `getInstallableModules`, `getInstallablePlugins`       | From `shared/types/modules.ts` + `shared/types/plugins.ts` |

```typescript
// ✅ Correct — no imports needed in composables/components
const isStore = computed(() => hasModule(org.value, "store"))
const modules = getInstallableModules()
const { data } = await useFetch("/api/v1/orgs/test/store/orders")
```

### Schema files (`server/db/schema/*.ts`)

Schema files run at **build time** — NO auto-imports available. Explicit imports only.

```typescript
// ✅ Correct — explicit imports required in schema files
import { index, integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core"

import { baseEntity, idField, timestamps } from "./_shared"
import { orgs } from "./orgs"

// ❌ Wrong — auto-imports are NOT available in schema files
// eq(...)      ← undefined at build time
// schema.orgs  ← undefined at build time
```

### Shared files (`shared/types/*.ts`, `shared/utils/*.ts`)

Shared files are context-neutral (run on both client and server).
Import Drizzle table types via `@nuxthub/db/schema` — never relative paths into `server/`.

```typescript
// ✅ Correct — use the @nuxthub/db/schema alias
import { storeOrders, storeProducts } from "@nuxthub/db/schema"
export type StoreOrder = typeof storeOrders.$inferSelect

// ❌ Wrong — relative path from shared into server breaks client build
import { storeOrders } from "../../server/db/schema/stores"
```

If you need to import from another shared file (e.g. types referencing other types):

```typescript
// ✅ Also correct in test files or scripts outside auto-import context
import type { OrgModule } from "#shared/types/modules"
import { hasModule } from "#shared/utils/modules"

// ✅ Correct — relative import within shared/
import type { OrgModuleKey } from "./modules"
```

### When `#shared/*` is needed vs auto-import

```typescript
// ✅ Auto-import covers these — no explicit import needed:
// - Vue components, composables (app/)
// - Server route handlers, utils (server/api/, server/utils/)

// ✅ Use #shared/* explicitly in these cases:
// - Test files (tests/*.test.ts) — outside auto-import context
// - Schema files (server/db/schema/*.ts) — build time only
// - Scripts (*.mjs, standalone tools)
// - One shared/ file importing from another shared/ file (use relative instead)

// If types seem missing → run: vp install
// (triggers nuxt prepare via postinstall, regenerates .nuxt/tsconfig.json)
```

Never import a cache object. Use Nitro's built-in caching wrappers — no import needed.

```typescript
// ✅ Correct — auto-available in server context, no import
export default defineCachedEventHandler(
  async (event) => {
    return await fetchExpensiveData()
  },
  { maxAge: 60 * 5, name: "my-handler" },
)

// For caching a utility function:
const getCachedOrgData = defineCachedFunction(
  async (orgId: string) => {
    return db.select().from(schema.orgs).where(eq(schema.orgs.id, orgId)).get()
  },
  {
    maxAge: 60,
    getKey: (orgId) => orgId,
  },
)

// ❌ Wrong — there is no importable cache/hub-cache module
import { hubCache } from "@nuxthub/cache" // NEVER
```

### KV Store — explicit import required

Unlike `db` and `schema`, KV is **not** auto-imported. Always import explicitly.

```typescript
// ✅ Correct
import { kv } from '@nuxthub/kv'

await kv.set('my-key', 'value', { ex: 3600 })
const value = await kv.get('my-key')

// ❌ Wrong — kv is NOT auto-imported, this will throw
await kv.set(...)
```

---

## 14. `useFetch` vs `$fetch` — Data Fetching Rules

Use the right tool for the right job. The rule is simple:

| Situation                                                                    | Use                                              |
| ---------------------------------------------------------------------------- | ------------------------------------------------ |
| Fetching data when a page/component mounts (needs SSR / hydration)           | `useFetch` or `useAsyncData`                     |
| Fetching data in response to a user action (button click, form submit, etc.) | `$fetch`                                         |
| Polling or manually re-fetching after a mutation                             | `useFetch` + call `refresh()`                    |
| Fetching only when a reactive value is non-null                              | `useFetch` with `immediate: false` + `execute()` |

### Never use `() => condition ? url : null` in useFetch

The `() => condition ? url : null` pattern causes a real `GET /null` HTTP request when
the condition becomes falsy. Use `immediate: false` + `execute()` instead.

```typescript
// ❌ Wrong — fires GET /null when selectedBatchId.value is empty
const { data } = useFetch(() =>
  selectedBatchId.value
    ? `/api/v1/orgs/@${handle}/batches/${selectedBatchId.value}/enrollments`
    : null,
)

// ✅ Correct — fetch only when value is present
const { data, execute } = useFetch(
  `/api/v1/orgs/@${handle}/batches/${selectedBatchId.value}/enrollments`,
  { immediate: false },
)

watch(
  selectedBatchId,
  (id) => {
    if (id) execute()
  },
  { immediate: true },
)
```

### `useFetch` — for data that loads with the component

```typescript
// ✅ Correct — useFetch handles SSR cookie forwarding automatically
const { data: orders, status, refresh } = await useFetch(`/api/v1/${handle}/store/orders`)

// ✅ Also correct — useRequestFetch is only needed with $fetch, not useFetch
async function onDelete() {
  const apiFetch = useRequestFetch()
  await apiFetch(`/api/v1/${handle}/store/orders/${id}`, { method: "DELETE" })
}
```

```typescript
// ❌ Wrong — useFetch inside a click handler
async function onDelete() {
  await useFetch(`/api/v1/${handle}/store/orders/${id}`, { method: "DELETE" }) // NEVER
}

// ❌ Wrong — useRequestFetch is redundant when using useFetch
const $apiFetch = useRequestFetch()
const { data } = useFetch(url, { $fetch: $apiFetch }) // useFetch already forwards cookies
```

> **`useRequestFetch` vs `useFetch`:** `useFetch` automatically forwards the session cookie on SSR — no extra setup needed. Only use `useRequestFetch()` when making manual `$fetch` calls inside server-side code (e.g. in a composable's action handler, not the initial data fetch).

### `$fetch` — for mutations and user-triggered actions

```typescript
// ✅ Correct — mutations always use $fetch
async function onSubmit() {
  loading.value = true
  try {
    await $fetch(`/api/v1/${handle}/store/orders`, {
      method: "POST",
      body: form,
    })
    toast.add({ title: "Order created", color: "success" })
    await refresh() // refresh the useFetch list
  } catch (err: any) {
    toast.add({ title: "Failed", description: err.data?.message, color: "error" })
  } finally {
    loading.value = false
  }
}
```

### Keys and deduplication

When using `useAsyncData` directly, always provide a unique key to prevent cache collisions.

```typescript
// ✅ Correct — unique key
const { data } = await useAsyncData(`store-orders-${handle}`, () =>
  $fetch(`/api/v1/${handle}/store/orders`)
)

// ❌ Wrong — generic key causes collisions across pages
const { data } = await useAsyncData('orders', () => $fetch(...))
```

---

## 15. Composables — Structure Rules

Composables live in `app/composables/` and are auto-imported everywhere in the `app/`
directory. They are the only place that bridges server API data with Vue components.

### What composables are allowed to do

- Call `useFetch` / `useAsyncData` / `$fetch`
- Import types from `shared/types/*.ts`
- Hold reactive state (`ref`, `computed`, `watch`)
- Expose `refresh()` for the component to call after mutations
- Wrap `$fetch` mutation calls with loading state + toast feedback

### What composables must NEVER do

- Import from `drizzle-orm` — no DB access on the client
- Import from `server/db/schema/` directly — use `@nuxthub/db/schema` types via `shared/types/`
- Contain business logic that belongs in `server/utils/`
- Make assumptions about the route — accept `handle` as a parameter

### Standard composable shape

```typescript
// app/composables/useStoreOrders.ts

export function useStoreOrders(handle: Ref<string> | string) {
  const h = isRef(handle) ? handle : ref(handle)

  // ── Data ──────────────────────────────────────────────────────────────────
  const {
    data: orders,
    status,
    refresh,
  } = useFetch(() => `/api/v1/${h.value}/store/orders`, { watch: [h] })

  // ── Mutations ─────────────────────────────────────────────────────────────
  const toast = useToast()
  const deleting = ref(false)

  async function deleteOrder(id: string) {
    deleting.value = true
    try {
      await $fetch(`/api/v1/${h.value}/store/orders/${id}`, { method: "DELETE" })
      toast.add({ title: "Order deleted", color: "success" })
      await refresh()
    } catch (err: any) {
      toast.add({ title: "Failed to delete", description: err.data?.message, color: "error" })
    } finally {
      deleting.value = false
    }
  }

  return { orders, status, refresh, deleting, deleteOrder }
}
```

### Naming convention

| Composable           | What it manages                      |
| -------------------- | ------------------------------------ |
| `useStoreOrders`     | Store orders list + mutations        |
| `useStoreOrder(id)`  | Single order detail + mutations      |
| `useAcademyStudents` | Academy student list                 |
| `useOrgBilling`      | Billing / plan state for current org |

Always prefix with `use`. Always one composable per vertical entity.

<!--NUXT END-->

---

<!--NUXT UI START-->

## 2. NuxtUI Components — Never Native HTML Elements

This project uses `@nuxt/ui` v4. Always use NuxtUI components. Never use raw HTML
interactive or presentational elements.

### Replacement Map

| Native HTML                             | NuxtUI                                                        |
| --------------------------------------- | ------------------------------------------------------------- |
| `<button>`                              | `<UButton>`                                                   |
| `<input type="text">`                   | `<UInput>`                                                    |
| `<input type="password">`               | `<UInput type="password">`                                    |
| `<textarea>`                            | `<UTextarea>`                                                 |
| `<select>`                              | `<USelect>` or `<USelectMenu>`                                |
| `<input type="checkbox">`               | `<UCheckbox>`                                                 |
| `<input type="radio">` group            | `<URadioGroup>`                                               |
| `<input type="checkbox" role="switch">` | `<USwitch>`                                                   |
| `<form>` with manual validation         | `<UForm :schema="zodSchema" :state="state">`                  |
| `<table>`                               | `<UTable :data="rows" :columns="cols">`                       |
| `<hr>`                                  | `<USeparator>`                                                |
| `<img class="rounded-full">` avatar     | `<UAvatar>`                                                   |
| `<span class="badge-...">`              | `<UBadge>`                                                    |
| `<div class="modal...">`                | `<UModal>`                                                    |
| `<div class="alert...">`                | `<UAlert>` or `toast.add({...})`                              |
| `<div class="spinner...">`              | `<UButton :loading="true">` or `<UIcon class="animate-spin">` |

### Examples

```vue
<!-- ✅ Correct -->
<UButton label="Save" @click="() => save()" />
<UButton label="Delete" color="error" variant="ghost" @click="() => remove(item)" />
<UInput v-model="search" placeholder="Search..." icon="i-lucide-search" />
<UTextarea v-model="notes" :rows="4" />
<UCheckbox v-model="agreed" label="I accept the terms" />
<URadioGroup v-model="mode" :items="modeOptions" />
<UBadge label="Active" color="success" />
<UBadge label="Pending" color="warning" />
<UBadge label="Failed" color="error" />

<!-- ❌ Wrong -->
<button @click="save()">Save</button>
<input type="text" v-model="search" class="rounded border px-3 py-2" />
<textarea v-model="notes"></textarea>
<input type="checkbox" v-model="agreed" />
<span class="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">Active</span>
```

### Do Not Pass Redundant Default Props

Never pass default props like `color="primary"`, `size="md"`, `variant="solid"`, or any other built-in defaults. NuxtUI components apply these defaults out of the box. Passing them adds visual noise, template clutter, and extra maintenance overhead.

```vue
<!-- ✅ Correct — clean and concise, relies on component defaults -->
<UButton label="Save" @click="() => save()" />
<UInput v-model="search" placeholder="Search..." icon="i-lucide-search" />
<UBadge label="New" />

<!-- ❌ Wrong — redundant defaults passed explicitly -->
<UButton label="Save" color="primary" size="md" variant="solid" @click="() => save()" />
<UInput v-model="search" size="md" />
<UBadge label="New" color="primary" size="md" variant="solid" />
```

### UTable — Column Definitions

`UTable` uses TanStack Table conventions. Always use `accessorKey` + `header`, never the old `key` + `label` format.

```typescript
// ✅ Correct
const columns = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "total", header: "Total" },
  { accessorKey: "actions", header: "Actions", class: "text-right" }, // extra props like class are fine
]
// ❌ Wrong — old format, throws "Columns require an id" error
const columns = [{ key: "name", label: "Name" }]
```

Pass data with `:data` and columns with `:columns`:

```vue
<UTable :data="orders" :columns="columns" />
```

Custom cell slots use `#[accessorKey]-cell`:

```vue
<UTable :data="items" :columns="columns">
  <template #status-cell="{ row }">
    <UBadge :label="row.original.status" color="success" />
  </template>
</UTable>
```

### UForm with Zod — Required for All Forms

All forms must use `<UForm>` with a Zod schema. No manual validation logic in components.

Always use `FormSubmitEvent<Schema>` as the submit handler type — it gives you the validated,
typed data directly without an extra `.parse()` call.

```typescript
import type { FormSubmitEvent } from "@nuxt/ui"
// ✅ Correct — full pattern with FormSubmitEvent
import * as z from "zod"

const schema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
})

type Schema = z.output<typeof schema>

// Reactive state — Partial<Schema> so fields can start as undefined
const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
})

// Submit handler receives already-validated, fully-typed data
async function onSubmit(event: FormSubmitEvent<Schema>) {
  await $fetch("/api/v1/auth/login", {
    method: "POST",
    body: event.data, // event.data is typed as Schema — no .parse() needed
  })
}
```

```vue
<!-- ✅ Correct — wire :schema, :state, @submit -->
<UForm :schema="schema" :state="state" class="space-y-4" @submit="(e) => onSubmit(e)">
  <UFormField label="Email" name="email">
    <UInput v-model="state.email" type="email" placeholder="you@example.com" />
  </UFormField>
  <UFormField label="Password" name="password">
    <UInput v-model="state.password" type="password" />
  </UFormField>
  <UButton type="submit" label="Sign In" :loading="isLoading" />
</UForm>

<!-- ❌ Wrong — missing FormSubmitEvent, accessing raw form state -->
<UForm :schema="schema" :state="state" @submit="() => onSubmit()">
  <!-- onSubmit() with no args — you lose the validated data -->
</UForm>
```

**Key rules:**

- State type is `Partial<Schema>` — fields start as `undefined`, not empty strings
- Use `z.output<typeof schema>` not `z.infer<typeof schema>` — captures transform/coerce results
- `event.data` is the fully validated, type-safe payload — no extra `.parse()` call
- `@submit="(e) => onSubmit(e)"` — follow the arrow-function convention, pass the event

```typescript
// ❌ Wrong patterns
async function onSubmit() {
  // no event arg — loses validated data
  const data = schema.parse(state) // re-parsing what UForm already validated
}

const state = ref({ email: "", password: "" }) // empty string ≠ undefined for Zod
// use reactive<Partial<Schema>>({ email: undefined, ... }) instead
```

### UButton color and variant

| Goal               | Props               | Notes                                |
| ------------------ | ------------------- | ------------------------------------ |
| Primary action     | _(omit)_            | Default is already `color="primary"` |
| Destructive        | `color="error"`     |                                      |
| Secondary / subtle | `variant="soft"`    |                                      |
| Ghost / icon-only  | `variant="ghost"`   |                                      |
| Outlined           | `variant="outline"` |                                      |
| Link style         | `variant="link"`    |                                      |

---

## 3. Colors — Always Use NuxtUI Semantic Tokens

Never use raw Tailwind color scale classes. Always use NuxtUI semantic tokens.
These tokens automatically handle dark mode — no `dark:` variants needed.

### Text

```vue
<!-- ✅ Correct -->
<span class="text-highlighted">Heading / emphasized text</span>
<span class="text-default">Body text</span>
<span class="text-muted">Secondary / supporting text</span>
<span class="text-toned">Tertiary text</span>
<span class="text-dimmed">Placeholders, captions, labels</span>
<span class="text-inverted bg-inverted">Text on dark/inverted surface</span>

<!-- Status -->
<span class="text-primary">Primary / brand</span>
<span class="text-success">Success / active / paid</span>
<span class="text-warning">Warning / pending / low stock</span>
<span class="text-error">Error / failed / overdue</span>
<span class="text-info">Informational</span>

<!-- ❌ Wrong — never use raw scale classes -->
<span class="text-neutral-500 dark:text-neutral-400">Wrong</span>
<span class="text-gray-600 dark:text-gray-300">Wrong</span>
<span class="text-green-600">Wrong — use text-success</span>
<span class="text-red-500">Wrong — use text-error</span>
```

### Backgrounds

```vue
<!-- ✅ Correct -->
<div class="bg-default">Page background</div>
<div class="bg-muted">Subtle section / sidebar</div>
<div class="bg-elevated">Card / panel / dropdown</div>
<div class="bg-accented">Highlighted / selected row</div>
<div class="bg-inverted text-inverted">Dark surface</div>

<!-- ❌ Wrong -->
<div class="bg-white dark:bg-neutral-900">Wrong</div>
<div class="bg-gray-50 dark:bg-zinc-800">Wrong</div>
```

### Borders

```vue
<!-- ✅ Correct -->
<div class="border-muted border">Standard</div>
<div class="border-muted border">Subtle</div>
<div class="border-accented border">Emphasized</div>

<!-- ❌ Wrong -->
<div class="border border-neutral-200 dark:border-neutral-800">Wrong</div>
<div class="border border-gray-300">Wrong</div>
```

### Icons (inherit text color)

```vue
<!-- ✅ Correct -->
<UIcon name="i-lucide-check" class="text-success" />
<UIcon name="i-lucide-alert-triangle" class="text-warning" />
<UIcon name="i-lucide-x" class="text-error" />
<UIcon name="i-lucide-info" class="text-info" />

<!-- ❌ Wrong -->
<UIcon name="i-lucide-check" class="text-green-500" />
<UIcon name="i-lucide-x" class="text-red-500" />
```

### Allowed Exceptions

Raw Tailwind color classes are only acceptable for:

- Chart/graph data series that need distinct hues
- `print:` prefix styles
- Gradient stops that have no semantic equivalent

---

## 13. NuxtUI — Props Over Slots & `:ui` Customization

### Always Prefer Props Over Slots

When a NuxtUI component accepts a prop for something, use the prop. Only use a slot
when you need rich custom markup that a prop cannot express.

```vue
<!-- ✅ Correct — use props -->
<UButton label="Save changes" icon="i-lucide-save" trailing-icon="i-lucide-chevron-right" />
<UInput placeholder="Search orders..." icon="i-lucide-search" />
<UBadge label="Active" color="success" />
<UAlert
  title="Session expiring"
  description="You will be logged out in 5 minutes."
  color="warning"
/>

<!-- ❌ Wrong — unnecessary slots when props exist -->
<UButton>
  <template #default>Save changes</template>
  <template #leading><UIcon name="i-lucide-save" /></template>
</UButton>

<UAlert>
  <template #title>Session expiring</template>
  <template #description>You will be logged out in 5 minutes.</template>
</UAlert>
```

### Always Prefer NuxtUI Over Native Tags

Even for structural or presentational elements — if a NuxtUI component exists, use it.

```vue
<!-- ✅ Correct -->
<USeparator />
<UAvatar src="/avatar.jpg" alt="User" />
<UBadge label="3" />
<UAlert title="No results" description="Try a different search." />
<UTooltip text="Copy to clipboard">
  <UButton icon="i-lucide-copy" variant="ghost" @click="() => copy()" />
</UTooltip>

<!-- ❌ Wrong -->
<hr class="border-muted my-4 border-t" />
<img src="/avatar.jpg" class="h-8 w-8 rounded-full" />
<span class="bg-primary rounded-full px-1 text-xs">3</span>
<div class="bg-warning/10 text-warning rounded p-4">No results</div>
```

### Overriding Design with the `:ui` Prop

When you need to adjust or override the internal styling, padding, or layout of a NuxtUI component, **always use the `:ui` prop**. NuxtUI components break down into internal parts (e.g. `body`, `header`, `footer`, `content`, `leading`, `trailing`, `base`).

Never use CSS `:deep(...)` hacks or redundant wrapper `<div>`s to force layout/padding changes on component internals.

```vue
<!-- ✅ Correct — tailor inner parts cleanly with :ui -->
<UCard :ui="{ body: 'p-0 sm:p-0', header: 'border-muted border-b' }">
  <!-- card content -->
</UCard>

<UModal v-model:open="isOpen" :ui="{ content: 'max-w-2xl' }">
  <template #content>
    <!-- modal body -->
  </template>
</UModal>

<UInput
  v-model="query"
  placeholder="Search..."
  icon="i-lucide-search"
  :ui="{ leading: 'pointer-events-none' }"
/>

<UTable :ui="{ th: 'text-toned py-2', td: 'py-3' }" :data="items" />

<!-- ❌ Wrong — wrapping in extra divs or using :deep() CSS -->
<div class="card-no-padding">
  <UCard>
    <!-- trying to remove padding with global / :deep() CSS -->
  </UCard>
</div>

<style scoped>
:deep(.u-card-body) {
  padding: 0 !important; /* NEVER — fragile and breaks across updates */
}
</style>
```

---

## 16. Icons — Always Lucide

This project uses the Lucide icon set exclusively. Always use `i-lucide-*` names.
Never use raw SVGs, inline `<svg>`, or other icon sets.

```vue
<!-- ✅ Correct — always i-lucide-* -->
<UIcon name="i-lucide-shopping-bag" />
<UIcon name="i-lucide-graduation-cap" />
<UButton icon="i-lucide-plus" label="Add" @click="() => open()" />
<UButton trailing-icon="i-lucide-chevron-right" label="Next" @click="() => next()" />

<!-- ❌ Wrong -->
<svg>...</svg>
<!-- no raw SVG -->
<UIcon name="i-heroicons-shopping-bag" />
<!-- no heroicons -->
<UIcon name="i-tabler-shopping-bag" />
<!-- no tabler -->
<img src="/icons/bag.svg" class="h-4 w-4" />
<!-- no img icons -->
```

Browse the full list at [lucide.dev](https://lucide.dev) or search with `i-lucide-` prefix in the IDE.

---

## 17. Modals & Dialogs — UModal / USlideOver Rules

### Never use `confirm()` or `alert()`

Browser-native `confirm()` and `alert()` are blocked in many contexts (Workers,
iframes) and look inconsistent. Always use `UModal` for confirmations and `toast`
for notifications.

```typescript
// ✅ Correct — UModal for destructive confirmations
const isDeleteOpen = ref(false)

async function onConfirmDelete() {
  await deleteOrder(selectedId.value)
  isDeleteOpen.value = false
}
```

```typescript
// ❌ Wrong — never use browser dialogs
if (confirm('Are you sure?')) { ... }   // NEVER
alert('Saved successfully')             // use toast.add(...) instead
```

### Always slot content into `#content` or `#body`

`UModal` and `USlideOver` treat any **default slot** content as the trigger element
(the thing that opens the modal). Always put your modal content inside the `#content`
slot (or `#body` where applicable). Putting content directly as default slot children
will render it as a button outside the modal.

```vue
<!-- ✅ Correct — content inside #content slot -->
<UModal v-model:open="isOpen">
  <template #content>
    <div class="p-4">
      <p class="text-default">Are you sure you want to delete this order?</p>
      <div class="flex gap-2 mt-4">
        <UButton label="Cancel" variant="ghost" @click="() => (isOpen = false)" />
        <UButton label="Delete" color="error" @click="() => onConfirmDelete()" />
      </div>
    </div>
  </template>
</UModal>

<!-- ✅ Correct — USlideOver with #content -->
<USlideOver v-model:open="isOpen">
  <template #content>
    <div class="p-6">
      <!-- slideOver body content -->
    </div>
  </template>
</USlideOver>

<!-- ❌ Wrong — content placed directly in default slot -->
<!-- This renders the div as a trigger BUTTON outside the modal -->
<UModal v-model:open="isOpen">
  <div class="p-4">
    <p>Are you sure?</p>          <!-- ← appears outside modal, treated as trigger -->
  </div>
</UModal>
```

### Confirmation modal pattern

```vue
<script setup lang="ts">
const isDeleteOpen = ref(false)
const targetId = ref<string | null>(null)

function promptDelete(id: string) {
  targetId.value = id
  isDeleteOpen.value = true
}

async function onConfirmDelete() {
  if (!targetId.value) return
  await deleteItem(targetId.value)
  isDeleteOpen.value = false
  targetId.value = null
}
</script>

<template>
  <UDashboardPanel>
    <template #body>
      <!-- list content with delete buttons -->
      <UButton label="Delete" color="error" variant="ghost" @click="() => promptDelete(item.id)" />
    </template>
  </UDashboardPanel>

  <!-- Modal lives OUTSIDE UDashboardPanel -->
  <UModal v-model:open="isDeleteOpen">
    <template #content>
      <UCard>
        <div class="space-y-4">
          <p class="text-default">This action cannot be undone. Delete this item?</p>
          <div class="flex justify-end gap-2">
            <UButton label="Cancel" variant="ghost" @click="() => (isDeleteOpen = false)" />
            <UButton label="Delete" color="error" @click="() => onConfirmDelete()" />
          </div>
        </div>
      </UCard>
    </template>
  </UModal>
</template>
```

<!--NUXT UI END-->

---

<!--NUXTHUB START-->

# NuxtHub — Cloudflare-Backed Full-Stack Storage

This project uses `@nuxthub/core` for Cloudflare edge storage. Four bindings are
available as auto-imported server utilities — no explicit imports needed.

## Bindings

| Binding      | Auto-import                 | Cloudflare resource  | Use for                                                |
| ------------ | --------------------------- | -------------------- | ------------------------------------------------------ |
| `db`         | `useDB()` or `db` (Drizzle) | D1 (SQLite)          | Relational data, all app tables                        |
| `hubBlob()`  | `hubBlob()`                 | R2 (S3-compatible)   | Files, images, documents, uploads                      |
| `hubKV()`    | `hubKV()`                   | KV                   | Sessions, rate limits, feature flags, short-lived data |
| `hubCache()` | via Nitro `cachedFunction`  | KV (cache namespace) | Server-side response / function caching                |

## Database — Drizzle ORM on D1

`db` is auto-imported everywhere in `server/`. Schema lives in `server/db/schema/*.ts`.
Migrations in `server/db/migrations/`. Always generate with `vp run db:generate` — never
hand-edit SQL.

```typescript
// ✅ Auto-imported — no import needed
const rows = await db.select().from(schema.storeOrders).where(eq(schema.storeOrders.orgId, id))

// ✅ Insert
const [order] = await db.insert(schema.storeOrders).values({ orgId, total }).returning()

// ✅ Update
await db
  .update(schema.orgs)
  .set({ modules: ["store"] })
  .where(eq(schema.orgs.id, orgId))
```

## Blob — R2 File Storage

```typescript
// ✅ Upload a file
const blob = hubBlob()
await blob.put("avatars/user-123.jpg", file, { contentType: "image/jpeg" })

// ✅ Get a public URL
const url = await blob.getURL("avatars/user-123.jpg")

// ✅ Delete
await blob.del("avatars/user-123.jpg")
```

## KV — Key-Value Store

```typescript
// ✅ Set with TTL (seconds)
const kv = hubKV()
await kv.set("ratelimit:ip:1.2.3.4", 5, { ttl: 60 })

// ✅ Get
const count = await kv.get<number>("ratelimit:ip:1.2.3.4")

// ✅ Delete
await kv.del("ratelimit:ip:1.2.3.4")
```

## Cache — Server Function Caching

Use Nitro's `cachedFunction` / `cachedEventHandler` — backed by the KV cache namespace.

```typescript
// ✅ Cache an expensive server function for 5 minutes
const getCachedOrgData = defineCachedFunction(
  async (orgId: string) => {
    return db.select().from(schema.orgs).where(eq(schema.orgs.id, orgId)).get()
  },
  { maxAge: 300, getKey: (orgId) => orgId },
)

// ✅ Cache a route handler
export default defineCachedEventHandler(async (event) => fetchExpensiveData(event), {
  maxAge: 60,
  name: "my-handler",
})
```

## Local Dev

In local dev, NuxtHub uses local SQLite / in-memory stores in `.data/`. No Cloudflare
account needed. Bindings are identical — code runs the same locally and on Cloudflare.

Run `vp run db:generate` after every schema change. Run `vp run dev` (or `vpr dev`) to
start with local bindings.

---

## 4. Type Flow — Schema → Types → Zod

All types flow in one direction. Never define types manually if they can be inferred
from the Drizzle schema.

### The Chain

```
server/db/schema/*.ts          ← Drizzle schema (source of truth)
        ↓
shared/types/*.ts              ← Inferred types via $inferSelect / $inferInsert
        ↓  (auto-imported — no explicit import needed)
server/api/v1/**/*.ts          ← Zod validation schemas (readValidatedBody / getValidatedQuery)
        ↓
app/composables/use*.ts        ← TypeScript types auto-imported from shared/types/
```

### Drizzle Schema → Shared Types

```typescript
// ✅ Correct — infer from schema, never hand-write
// shared/types/store.ts
import { storeOrders, storeProducts } from "@nuxthub/db/schema"

export type StoreOrder = typeof storeOrders.$inferSelect
export type NewStoreOrder = typeof storeOrders.$inferInsert
export type StoreProduct = typeof storeProducts.$inferSelect
```

```typescript
// ❌ Wrong — never hand-write types that duplicate the schema
export interface StoreOrder {
  id: string
  orgId: string
  status: string // wrong — loses enum info
  total: number
  // ... duplicates schema, gets out of sync
}
```

### Zod Validation in API Routes

```typescript
// ✅ Correct — Zod schema in route, readValidatedBody
import { z } from "zod"

const body = z.object({
  productId: zUuidLike,
  quantity: z.number().int().min(1).max(9999),
  notes: zTextLong(1000).optional(),
})

export default defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, (d) => body.parse(d))
  // data is fully typed
})

// ❌ Wrong — unvalidated readBody
export default defineEventHandler(async (event) => {
  const data = await readBody(event) // never — unsafe
})
```

### Shared Zod Primitives

Use the project's shared Zod helpers (auto-imported in server context):

| Helper               | Use for                                      |
| -------------------- | -------------------------------------------- |
| `zUuidLike`          | ID fields                                    |
| `zHandleParam`       | Org handle route params                      |
| `zTextShort(max?)`   | Short text fields (default 255)              |
| `zTextLong(max?)`    | Long text / description fields               |
| `zCurrencyMinor`     | Money amounts in smallest unit (cents/paisa) |
| `zUnixMs`            | Unix millisecond timestamps                  |
| `zPhoneE164Loose`    | Phone numbers                                |
| `zEmailNormalized`   | Email addresses                              |
| `zDisplayname(max?)` | Display names                                |
| `zIntId`             | Positive integers                            |

### Type Location Rules

| What                                                   | Where                                        |
| ------------------------------------------------------ | -------------------------------------------- |
| DB entity types (`StoreOrder`, `AcademyStudent`)       | `shared/types/<vertical>.ts`                 |
| Org module registry + types                            | `shared/types/modules.ts`                    |
| Plugin registry + types                                | `shared/types/plugins.ts`                    |
| Taxonomy / capability types (`OrgCategory`, `OrgType`) | `shared/types/taxonomy.ts`                   |
| Auth/session types                                     | `shared/types/auth.d.ts`                     |
| API request/response shapes                            | inline Zod in route file                     |
| Component prop types                                   | inline `interface Props` in `<script setup>` |

---

## 5. Database Schema Conventions

### File Organisation

One file per vertical domain in `server/db/schema/`:

```
academies.ts    bookings.ts    canteen.ts    clinics.ts
stores.ts       restaurants.ts gyms.ts       procurement.ts
...
```

Never add tables for a new vertical to an existing unrelated schema file.

### Every Table Uses `baseEntity()`

All schema building blocks live in `server/db/schema/_shared.ts`. Never re-implement them.

```typescript
// server/db/schema/_shared.ts — the four exports you use every day

idField() // UUIDv7 text primary key
timestamps // createdAt + updatedAt (Unix ms integers, Drizzle-managed)
softDelete // deletedAt (nullable integer — null = active)
baseEntity() // idField() + timestamps + softDelete spread together
```

```typescript
import { baseEntity, idField, timestamps } from "./_shared"

// ✅ Standard entity table — use baseEntity()
export const storeOrders = sqliteTable("store_orders", {
  ...baseEntity(), // id (UUIDv7), createdAt, updatedAt, deletedAt
  orgId: text()
    .notNull()
    .references(() => orgs.id),
  // ... domain columns
})

// ✅ Settings table — one row per org, no soft delete needed
export const storeSettings = sqliteTable("store_settings", {
  id: idField(),
  ...timestamps, // createdAt + updatedAt only (no deletedAt)
  orgId: text()
    .notNull()
    .unique()
    .references(() => orgs.id),
})

// ✅ Junction / log table — only needs id + createdAt
export const orgRevenueSharesLedger = sqliteTable("org_revenue_shares_ledger", {
  id: idField(),
  createdAt: integer()
    .notNull()
    .$defaultFn(() => Date.now()),
  // ... columns
})
```

### IDs — UUIDv7 vs `crypto.randomUUID()`

**Always use `idField()` for primary keys.** It generates a UUIDv7 via the `uuid` package.

```typescript
// ✅ Correct — use idField() in schema
id: idField() // → text().primaryKey().$defaultFn(() => uuidv7())

// ✅ Correct — generate a UUIDv7 manually in server code when needed
import { v7 as uuidv7 } from "uuid"
const id = uuidv7()
```

**UUIDv7 vs `crypto.randomUUID()` — know the difference:**

|                          | UUIDv7 (`uuidv7()`)                          | UUIDv4 (`crypto.randomUUID()`)           |
| ------------------------ | -------------------------------------------- | ---------------------------------------- |
| **Sort order**           | Time-sortable (timestamp prefix)             | Random, unsortable                       |
| **DB index performance** | Excellent — inserts at the end of the B-tree | Poor — random scatter causes page splits |
| **Use for**              | All primary keys in schema                   | One-time tokens, nonces, invite codes    |
| **Import**               | `import { v7 as uuidv7 } from "uuid"`        | Built-in `crypto.randomUUID()`           |

```typescript
// ✅ Correct
const orderId = uuidv7() // primary key — time-sortable
const inviteToken = crypto.randomUUID() // one-time token — doesn't need sortability

// ❌ Wrong — never use randomUUID for primary keys
const id = crypto.randomUUID() // random scatter, bad for index performance
```

**Rule:** `idField()` in schema (UUIDv7). `crypto.randomUUID()` only for short-lived tokens and nonces.

### Never Pass `id`, `createdAt`, or `updatedAt` on Insert

These are set automatically by Drizzle — never pass them in `.values({})` or `$fetch` bodies.

```typescript
// ✅ Correct — omit id, createdAt, updatedAt entirely
const [order] = await db
  .insert(schema.storeOrders)
  .values({
    orgId: org.id,
    orderNumber,
    total: 1999,
    status: "pending",
    // id        ← set by .$defaultFn(() => uuidv7())
    // createdAt ← set by .$defaultFn(() => Date.now())
    // updatedAt ← set by .$defaultFn(() => Date.now())
  })
  .returning()

// ✅ Correct — on update, updatedAt is also automatic
await db
  .update(schema.storeOrders)
  .set({ status: "confirmed" }) // updatedAt ← set by .$onUpdate(() => Date.now())
  .where(eq(schema.storeOrders.id, orderId))

// ❌ Wrong — manually passing auto-managed fields
await db.insert(schema.storeOrders).values({
  id: uuidv7(), // redundant — idField() already does this
  createdAt: Date.now(), // redundant — $defaultFn() already does this
  updatedAt: Date.now(), // redundant — $defaultFn() already does this
  orgId: org.id,
  total: 1999,
})
```

The same applies to API route bodies — clients never send `id`, `createdAt`, or `updatedAt`.
Zod schemas for incoming request bodies must never include these fields.

### Naming Conventions

- Table names: `snake_case`, prefixed with vertical name (`store_orders`, `academy_students`)
- TypeScript export: `camelCase` matching table prefix (`storeOrders`, `academyStudents`)
- Settings tables: always `<vertical>Settings` (one per org, `unique()` on `orgId`)
- Index names: `<table>_<column(s)>_idx`

### Required Columns

```typescript
// Every org-scoped table must have:
orgId: text().notNull().references(() => orgs.id)

// Every table that has an org-scoped orgId must have an index:
(table) => [
  index("<table>_org_idx").on(table.orgId),
]

// Financial documents must have deletedAt (via baseEntity):
...baseEntity()  // includes deletedAt
```

### Money — Always Integer (Cents / Smallest Unit)

```typescript
// ✅ Correct — integer cents
price: integer().notNull().default(0),   // 1999 = $19.99
taxAmount: integer().notNull().default(0),

// ❌ Wrong — never float for money
price: real().notNull(),   // NEVER
price: numeric().notNull(), // NEVER
```

### Timestamps — Always Unix Milliseconds (integer)

```typescript
// ✅ Correct — Unix milliseconds as integer, via Date.now()
// Always use ...timestamps or ...baseEntity() from server/db/schema/_shared.ts
// Never hand-write these columns in a new table.
createdAt: integer().notNull().$defaultFn(() => Date.now()),  // 1727856000000
updatedAt: integer().notNull().$defaultFn(() => Date.now()).$onUpdate(() => Date.now()),

// ❌ Wrong — wrong type, wrong unit, wrong approach
createdAt: text(),                                                          // never ISO string
createdAt: integer().$defaultFn(() => Math.floor(Date.now() / 1000)),      // never seconds
createdAt: integer({ mode: "timestamp_ms" }).$defaultFn(() => new Date()), // gives Date, not number
```

**Why `integer()` (number) not `integer({ mode: "timestamp_ms" })` (Date)?**
The entire codebase treats timestamps as numbers — filtering, sorting, comparisons all use
arithmetic like `Date.now() - 86400000`. Switching to `Date` objects would break every query.

**`$defaultFn` and `$onUpdate` are Drizzle-only** — they do NOT create SQL `DEFAULT` expressions
or triggers. Always mutate through `db.update()` (never raw SQL) to keep `updatedAt` accurate.

### Sequential Numbers — Always Atomic Counters

Never use `Math.random()` to generate order numbers, invoice numbers, member codes, or
any identifier that must be unique. Always use atomic `UPDATE + RETURNING` on a counter
column in the settings table.

```typescript
// ✅ Correct — atomic counter in utils
export async function generateOrderNumber(orgId: string): Promise<string> {
  const [updated] = await db
    .update(schema.storeSettings)
    .set({ orderCounter: sql`${schema.storeSettings.orderCounter} + 1`, updatedAt: Date.now() })
    .where(eq(schema.storeSettings.orgId, orgId))
    .returning({
      counter: schema.storeSettings.orderCounter,
      prefix: schema.storeSettings.orderPrefix,
    })
  return `${updated!.prefix}-${String(updated!.counter).padStart(4, "0")}`
}

// ❌ Wrong — collision risk under concurrent load
const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`
```

### Migrations

Always generate migrations with `vp run db:generate`. Never hand-edit migration SQL files.
Run after every schema change before committing.

---

## 6. Org Modules — `hasModule` Helper

The `orgs` table is being migrated (SCHEMA-1) from 30 boolean `has*` columns to a single
`modules TEXT` JSON array. Use the helper functions — never access `org.hasStore` directly.

```typescript
// ✅ Correct — use helpers (auto-imported from shared/utils/modules.ts)
hasModule(org, "store") // true | false — single check
hasModules(org, ["store", "loyalty"]) // ALL must be enabled
hasAnyModule(org, ["store", "b2b"]) // ANY one enabled

// ✅ In server access guards
if (!hasModule(org, "store")) throw createError({ status: 404 })

// ✅ In Vue composables
const isStore = computed(() => hasModule(org.value, "store"))
const isEducation = computed(() => hasAnyModule(org.value, ["academy", "hostel", "library"]))
```

```typescript
// ❌ Wrong — direct boolean field access (breaks after SCHEMA-1 migration)
if (!org.hasStore) throw createError({ status: 404 })
const isStore = computed(() => org.value?.hasStore ?? false)
```

The module registry lives in `shared/types/modules.ts` as `ORG_MODULE_REGISTRY`.
`OrgModuleKey` is derived from the registry — never maintain a separate keys array.
`getInstallableModules()` uses `import.meta.dev` to filter `'dev'` availability modules.

### Module availability — `useModule()`

Use `useModule(key)` anywhere you need to check if a module is accessible. Auto-imported everywhere — no import needed.

```typescript
const { isDev, isComingSoon, isBeta, isStable, isAccessible, mod } = useModule("task_board")
```

| Property       | Meaning                                                                        |
| -------------- | ------------------------------------------------------------------------------ |
| `isDev`        | `availability === 'dev'`                                                       |
| `isComingSoon` | `availability === 'coming_soon'`                                               |
| `isBeta`       | `availability === 'beta'`                                                      |
| `isStable`     | none of the above                                                              |
| `isAccessible` | `true` in dev for dev modules; `true` for stable/beta; `false` for coming_soon |
| `mod`          | Full `OrgModuleDefinition` from registry                                       |

```vue
<script setup lang="ts">
const { isDev, isAccessible } = useModule("task_board")

// Guard — redirect if not accessible
if (!isAccessible) await navigateTo(`/@${handle.value}`)
</script>

<template>
  <UBadge v-if="isDev" label="Dev Only" color="warning" />
  <UButton v-if="isAccessible" label="Open Task Board" />
  <p v-else class="text-muted text-sm">Coming soon</p>
</template>
```

**Server routes** — `requireModuleAvailable(key)` is auto-imported from `server/utils/modules.ts`:

```typescript
export default defineEventHandler(async (event) => {
  requireModuleAvailable("task_board") // 503 in prod, no-op in dev
  // ...
})
```

Plugins (Super Apps) are different — they live in `org_plugins` table rows, not in a static
registry. Plugin helpers are **server-only** (`server/utils/plugins.ts`) because configs
contain encrypted credentials. Never import plugin utils in `shared/` or client code.

```typescript
// ✅ Server-side plugin checks (server/utils/ or server/api/ only)
import { hasPlugin, getPluginPublicConfig } from "~/server/utils/plugins"
await hasPlugin(org.id, "stripe_payments")
await getPluginPublicConfig(org.id, "whatsapp_cloud")

// ❌ Wrong — plugins have encrypted secrets, never check them client-side
const plugins = await $fetch("/api/v1/orgs/x/plugins/config")
```

---

<!--NUXTHUB END-->

---

## 9. CLI Commands — Quick Reference

Always use `vp` (Vite+) commands. Never use `npm run`, `npx`, `yarn`, or `pnpm` directly
for project tasks.

| Task                        | Command                  | Notes                                          |
| --------------------------- | ------------------------ | ---------------------------------------------- |
| Start dev server            | `vp run dev`             | Uses `package.json` dev script                 |
| Install dependencies        | `vp i`                   | Alias for `vp install`                         |
| Add a package               | `vp add <package>`       | Adds to `package.json` and installs            |
| Remove a package            | `vp remove <package>`    | Removes from `package.json`                    |
| Execute a package binary    | `vpx <binary>`           | Like `npx` but through Vite+                   |
| Format + lint + type-check  | `vp check`               | Run before every commit                        |
| Auto-fix format/lint issues | `vp check --fix`         | Fix all auto-fixable issues                    |
| Run tests                   | `vp test`                | Runs Vitest                                    |
| Build for production        | `vp build`               | Rolldown/Vite production build                 |
| Generate DB migration       | `vp run db:generate`     | After every schema change                      |
| Pin package manager version | `vp env pin pnpm@latest` | Pins pnpm version in the project               |
| Show toolchain versions     | `vp toolchain`           | Inspect Vite+, Vitest, Oxlint versions         |
| Diagnose environment issues | `vp env doctor`          | Run when setup looks wrong                     |
| Run a custom script/task    | `vp run <name>`          | For scripts in `package.json` or `vite.config` |

---

## 10. Server Utils — Service Layer Pattern

Every vertical has a util file `server/utils/<vertical>.ts`. Business logic, DB queries,
and sequential number generators live here — never inline in route handlers.

### The Three-Layer Rule

```
Route handler   → validate input (Zod) + call util + return result
server/utils/   → business logic, DB queries, sequential numbers, calculations
server/db/      → schema only — no logic
```

### Required Utils Per Vertical

```typescript
// server/utils/<vertical>.ts — every vertical must have:

// 1. Access guard
export async function require<Vertical>Access(event, handle, minRole) {
  const base = await resolveOrgMembership(event, handle, minRole)
  if (!base.org.has<Vertical>) throw createError({ status: 404 })
  const settings = await getOrCreate<Vertical>Settings(base.org.id)
  return { ...base, settings }
}

// 2. Settings resolver (lazy-creates row)
export async function getOrCreate<Vertical>Settings(orgId: string) { ... }

// 3. Sequential number generator (for each numbered entity)
export async function generate<Vertical><DocumentType>Number(orgId: string) { ... }

// 4. Pure calculation functions (no DB calls, no side effects)
export function compute<Vertical>Totals(items, settings) { ... }
```

### Route Handler Shape

```typescript
// ✅ Correct — thin handler
export default defineEventHandler(async (event) => {
  const handle = getValidatedRouterParam(event, "handle", zHandleParam)
  const { org, settings } = await requireStoreAccess(event, handle, "staff")
  await requireOrgPlan(event, org.id, "starter", "Store")
  const data = await readValidatedBody(event, (d) => body.parse(d))

  const orderNumber = await generateOrderNumber(org.id)
  const { subtotal, taxAmount, total } = computeStoreOrderTotals(data.items, settings)

  const [order] = await db.insert(schema.storeOrders).values({ ... }).returning()
  return order
})

// ❌ Wrong — logic in handler
export default defineEventHandler(async (event) => {
  const data = await readBody(event)                          // no validation
  const rand = Math.floor(Math.random() * 9000)               // random ID
  let subtotal = 0                                            // inline calculation
  for (const it of data.items) { subtotal += it.price * it.qty }
  // ...
})
```

---

## 11. Error Handling — `createError`

Always use `createError` for server-side errors. Always include all three fields:
`status` (HTTP code), `statusText` (short label), and `message` (human-readable detail).

```typescript
// ✅ Correct — all three fields, always
throw createError({
  status: 404,
  statusText: "Not Found",
  message: "Order not found or does not belong to this organization",
})

throw createError({
  status: 403,
  statusText: "Forbidden",
  message: `Insufficient permissions. Requires at least '${minRole}' role.`,
})

throw createError({
  status: 400,
  statusText: "Bad Request",
  message: "Cannot cancel an order that has already been shipped",
})

throw createError({
  status: 409,
  statusText: "Conflict",
  message: "A student with this roll number already exists in this batch",
})

// ❌ Wrong — missing fields, vague messages
throw createError({ status: 404 }) // no message
throw createError({ message: "not found" }) // no status
throw new Error("something went wrong") // never use plain Error in handlers
```

### Standard Status Codes

| Situation                               | Status | statusText                |
| --------------------------------------- | ------ | ------------------------- |
| Resource not found                      | `404`  | `"Not Found"`             |
| Not authenticated (no session)          | `401`  | `"Unauthorized"`          |
| Authenticated but wrong role/plan       | `403`  | `"Forbidden"`             |
| Invalid input / business rule violation | `400`  | `"Bad Request"`           |
| Duplicate / unique constraint conflict  | `409`  | `"Conflict"`              |
| External service (Stripe, SMS) failed   | `502`  | `"Bad Gateway"`           |
| Unexpected server error                 | `500`  | `"Internal Server Error"` |

### Client-side — `useToast` for User-Facing Errors

Never surface raw server error messages directly. Use the toast composable.

```typescript
// ✅ Correct
const toast = useToast()

try {
  await $fetch("/api/v1/...")
  toast.add({ title: "Saved successfully", color: "success" })
} catch (err: any) {
  toast.add({
    title: "Failed to save",
    description: err.data?.message ?? "Something went wrong. Please try again.",
    color: "error",
  })
}

// ❌ Wrong
alert(err.message)
```
