import { defineNuxtModule, addTemplate } from 'nuxt/kit'
import { join } from 'pathe'
import { setupSchemas } from './schemas/setup'
import { setupOrm } from './orm/setup'

export default defineNuxtModule({
  meta: {
    name: 'registry',
  },
  async setup(options, nuxt) {
    console.log('Registry is loaded!')

    // Add aliases for the bundled registries
    nuxt.options.alias['#schemas'] = join(nuxt.options.buildDir, 'registry/schemas.mjs')
    nuxt.options.alias['#orm'] = join(nuxt.options.buildDir, 'registry/orm.mjs')

    // Add auto-imports
    nuxt.hook('imports:extend', imports => {
      imports.push({ name: 'schemas', from: '#schemas' })
      imports.push({ name: 'orm', from: '#orm' })
    })

    // Add Nitro auto-imports
    nuxt.hook('nitro:config', nitroConfig => {
      nitroConfig.alias = nitroConfig.alias || {}
      nitroConfig.alias['#schemas'] = join(nuxt.options.buildDir, 'registry/schemas.mjs')
      nitroConfig.alias['#orm'] = join(nuxt.options.buildDir, 'registry/orm.mjs')

      nitroConfig.imports = nitroConfig.imports || {}
      nitroConfig.imports.presets = nitroConfig.imports.presets || []
      nitroConfig.imports.presets.push({
        from: '#schemas',
        imports: ['schemas']
      })
      nitroConfig.imports.presets.push({
        from: '#orm',
        imports: ['orm']
      })
    })
    addTemplate({
      filename: 'registry.d.ts',
      getContents: () => `
declare module '#schemas' {
  const schemas: typeof import('${join(nuxt.options.buildDir, 'registry/schemas.mjs')}').schemas
  export { schemas }
}

declare module '#orm' {
  const orm: typeof import('${join(nuxt.options.buildDir, 'registry/orm.mjs')}').orm
  export { orm }
}
      `,
      write: true
    })

    nuxt.hook('prepare:types', ({ references }) => {
      references.push({ path: join(nuxt.options.buildDir, 'registry.d.ts') })
    })

    await setupSchemas(nuxt)
    await setupOrm(nuxt)
  },
})
