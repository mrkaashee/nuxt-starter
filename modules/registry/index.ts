import { defineNuxtModule, addTemplate } from 'nuxt/kit'
import { join } from 'pathe'
import { setupSchemas } from './schemas/setup'
import { setupOrm } from './orm/setup'
import fs from 'node:fs'

export default defineNuxtModule({
  meta: {
    name: 'registry',
  },
  async setup(options, nuxt) {
    const ormPath = join(nuxt.options.buildDir, 'registry/orm.ts')
    const schemasPath = join(nuxt.options.buildDir, 'registry/schemas.ts')

    await setupSchemas(nuxt)
    await setupOrm(nuxt)

    nuxt.options.alias['#schemas'] = schemasPath

    const { addImports } = await import('nuxt/kit')
    addImports({ name: 'schemas', from: schemasPath })

    addTemplate({
      filename: 'registry/app.d.ts',
      getContents: () => `
declare module '#schemas' {
  const schemas: typeof import('${join(nuxt.options.buildDir, 'registry/schemas.ts')}').schemas
  export { schemas }
}
      `,
      write: true,
    })

    addTemplate({
      filename: 'registry/server.d.ts',
      getContents: () => `
declare module '#schemas' {
  const schemas: typeof import('${join(nuxt.options.buildDir, 'registry/schemas.ts')}').schemas
  export { schemas }
}

declare module '#orm' {
  const orm: typeof import('${join(nuxt.options.buildDir, 'registry/orm.ts')}').orm
  export { orm }
}
      `,
      write: true,
    })

    // BLOCK NITRO TYPES FROM APP CONTEXT
    // This blocks Nitro's global types from leaking into app files via TypeScript logic
    nuxt.options.typescript.tsConfig = nuxt.options.typescript.tsConfig || {}
    nuxt.options.typescript.tsConfig.exclude = nuxt.options.typescript.tsConfig.exclude || []
    if (!nuxt.options.typescript.tsConfig.exclude.includes('./types/nitro.d.ts')) {
      nuxt.options.typescript.tsConfig.exclude.push('./types/nitro.d.ts')
    }

    const performScrub = () => {
      const buildDir = nuxt.options.buildDir

      // 1. Physical Scrub for ESLint Configuration
      const eslintPath = join(buildDir, 'eslint.config.mjs')
      if (fs.existsSync(eslintPath)) {
        let content = fs.readFileSync(eslintPath, 'utf8')
        const serverOnly = [
          'orm', 'db', 'schema', 'sql', 'eq', 'ne', 'and', 'or', 'like', 'isNull', 'asc', 'count',
          'inArray', 'between', 'lt', 'lte', 'gt', 'gte', 'not', 'desc', 'sqliteTable', 'int', 'real',
          'text', 'alias', 'escapeKey', 'sendSuccess',
        ]
        let changed = false
        for (const word of serverOnly) {
          const regex = new RegExp(`"${word}",?`, 'g')
          if (regex.test(content)) {
            content = content.replace(regex, '')
            changed = true
          }
        }
        if (changed) {
          content = content.replace(/,\s*,/g, ',').replace(/\[\s*,/g, '[').replace(/,\s*\]/g, ']')
          fs.writeFileSync(eslintPath, content)
        }
      }

      // 2. Physical Scrub for nuxt.d.ts (Triple-slash references)
      const nuxtDtsPath = join(buildDir, 'nuxt.d.ts')
      if (fs.existsSync(nuxtDtsPath)) {
        const content = fs.readFileSync(nuxtDtsPath, 'utf8')
        const lines = content.split('\n')
        const filteredLines = lines.filter(line => {
          // Remove Nitro, server utilities, and hub/db leakage from global types
          if (line.includes('nitro') || line.includes('server') || line.includes('hub/db')) {
            return false
          }
          return true
        })
        if (lines.length !== filteredLines.length) {
          fs.writeFileSync(nuxtDtsPath, filteredLines.join('\n'))
        }
      }
    }

    // MULTI-STAGE ISOLATION
    // Stage 1: Filter internal Nuxt memory references
    nuxt.hook('prepare:types', options => {
      for (let i = options.references.length - 1; i >= 0; i--) {
        const ref = options.references[i]
        let refStr = ''
        if (typeof ref === 'string') refStr = ref
        else if (typeof ref === 'object' && ref !== null) refStr = (ref as any).path || (ref as any).types || ''

        if (refStr.includes('nitro') || refStr.includes('server') || refStr.includes('hub/db') || refStr === 'nitro') {
          options.references.splice(i, 1)
        }
      }
      const appDtsPath = './registry/app.d.ts'
      if (!options.references.some(r => (typeof r === 'object' && 'path' in r && r.path === appDtsPath))) {
        options.references.push({ path: appDtsPath })
      }
    })

    // Stage 2: Live Watcher for Physical File Scrubbing
    // Nuxt often rewrites these files multiple times; this ensures they are cleaned immediately.
    const buildDirWatcher = fs.watch(nuxt.options.buildDir, (event, filename) => {
      if (filename === 'nuxt.d.ts' || filename === 'eslint.config.mjs') {
        performScrub()
      }
    })

    // Stage 3: Hook-based Scrubbing as insurance
    nuxt.hook('ready', () => performScrub())
    nuxt.hook('app:templatesGenerated' as any, () => performScrub())
    nuxt.hook('close', () => {
      performScrub()
      buildDirWatcher.close()
    })

    // Explicitly filter out server-only globals from auto-import registry
    nuxt.hook('imports:extend', imports => {
      const serverOnly = ['orm', 'db', 'schema', 'sendSuccess', 'escapeKey']
      for (let i = imports.length - 1; i >= 0; i--) {
        if (serverOnly.includes(imports[i].name)) {
          imports.splice(i, 1)
        }
      }
    })

    // NITRO SERVER-ONLY CONFIGURATION
    nuxt.hook('nitro:config', nitroConfig => {
      const serverDts = join(nuxt.options.buildDir, 'registry/server.d.ts')
      if (nitroConfig.imports !== false) {
        nitroConfig.imports = nitroConfig.imports || {}
        nitroConfig.imports.presets = nitroConfig.imports.presets || []
        nitroConfig.imports.presets.push({
          imports: [
            { name: 'schemas', from: schemasPath },
            { name: 'orm', from: ormPath },
          ],
        })
      }
      nitroConfig.alias = nitroConfig.alias || {}
      nitroConfig.alias['#schemas'] = schemasPath
      nitroConfig.alias['#orm'] = ormPath
      nitroConfig.typescript = nitroConfig.typescript || {}
      nitroConfig.typescript.tsConfig = nitroConfig.typescript.tsConfig || {}
      nitroConfig.typescript.tsConfig.include = nitroConfig.typescript.tsConfig.include || []
      // Inject server-specific type definitions (includes ORM)
      if (!nitroConfig.typescript.tsConfig.include.includes(serverDts)) {
        nitroConfig.typescript.tsConfig.include.push(serverDts)
      }
    })
  },
})
