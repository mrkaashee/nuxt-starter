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
    const logPath = join(nuxt.options.rootDir, 'registry_debug.log')
    const log = (msg: string) => {
      console.log(msg)
      fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${msg}\n`)
    }

    log('Registry is loaded!')

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
    nuxt.options.typescript.tsConfig = nuxt.options.typescript.tsConfig || {}
    nuxt.options.typescript.tsConfig.exclude = nuxt.options.typescript.tsConfig.exclude || []
    if (!nuxt.options.typescript.tsConfig.exclude.includes('./types/nitro.d.ts')) {
      nuxt.options.typescript.tsConfig.exclude.push('./types/nitro.d.ts')
    }

    const performScrub = () => {
      const buildDir = nuxt.options.buildDir

      // 1. Scrub ESLint
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
          log('Physically scrubbed eslint.config.mjs')
        }
      }

      // 2. Scrub nuxt.d.ts
      const nuxtDtsPath = join(buildDir, 'nuxt.d.ts')
      if (fs.existsSync(nuxtDtsPath)) {
        const content = fs.readFileSync(nuxtDtsPath, 'utf8')
        const lines = content.split('\n')
        const filteredLines = lines.filter(line => {
          if (line.includes('nitro') || line.includes('server') || line.includes('hub/db')) {
            return false
          }
          return true
        })
        if (lines.length !== filteredLines.length) {
          fs.writeFileSync(nuxtDtsPath, filteredLines.join('\n'))
          log('Physically scrubbed nuxt.d.ts')
        }
      }
    }

    // MULTI-STAGE SCRUBBING
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

    // Use every possible late hook
    nuxt.hook('ready', () => performScrub())

    nuxt.hook('app:templatesGenerated' as any, () => performScrub())
    nuxt.hook('close', () => {
      log('Hook close triggered - performing FINAL scrub')
      performScrub()
    })

    // Auto-imports filter
    nuxt.hook('imports:extend', imports => {
      const serverOnly = ['orm', 'db', 'schema', 'sendSuccess', 'escapeKey']
      for (let i = imports.length - 1; i >= 0; i--) {
        if (serverOnly.includes(imports[i].name)) {
          imports.splice(i, 1)
        }
      }
    })

    // Nitro configuration
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
      if (!nitroConfig.typescript.tsConfig.include.includes(serverDts)) {
        nitroConfig.typescript.tsConfig.include.push(serverDts)
      }
    })

    log('Setup complete.')
  },
})
