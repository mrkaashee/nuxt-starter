import type { Nuxt } from '@nuxt/schema'
import { getLayerDirectories, updateTemplates, addTemplate } from '@nuxt/kit'
import { join, resolve as resolveFs, relative } from 'pathe'
import { glob } from 'tinyglobby'
import chokidar from 'chokidar'
import { build } from 'tsdown'

export async function setupSchemas(nuxt: Nuxt) {
// Handle schemas
  nuxt.hook('modules:done', async () => {
    // generate shared schemas
    await generateSharedSchemas(nuxt)
  })
}

async function generateSharedSchemas(nuxt: Nuxt) {
  const getSchemasPaths = async () => {
    const schemasPatterns = getLayerDirectories(nuxt).map(layer => [
      resolveFs(layer.shared, 'schemas/*.{ts,js,mjs,cjs}').replace(/\\/g, '/'),
      resolveFs(layer.shared, 'schemas/*/index.{ts,js,mjs,cjs}').replace(/\\/g, '/'),
      resolveFs(layer.shared, 'utils/schemas/*.{ts,js,mjs,cjs}').replace(/\\/g, '/'),
      resolveFs(layer.shared, 'utils/schemas/*/index.{ts,js,mjs,cjs}').replace(/\\/g, '/')
    ]).flat()

    const schemasPaths = await glob(schemasPatterns, { absolute: true, onlyFiles: true })

    console.info({ schemasPatterns })
    console.info({ schemasPaths })

    // await nuxt.callHook('registry:schemas:extend', schemasPaths)

    return schemasPaths
  }

  let schemasPaths = await getSchemasPaths()

  // Watch schemas files for changes
  if (nuxt.options.dev && !nuxt.options._prepare) {
    // chokidar doesn't support glob patterns, so we need to watch the shared/schemas directories
    const watchDirs = getLayerDirectories(nuxt).map(layer => resolveFs(layer.shared, 'utils', 'schemas'))
    const watcher = chokidar.watch(watchDirs, {
      ignoreInitial: true
    })
    watcher.on('all', async (event, path) => {
      // console.info({ event })
      // console.info({ path })
      if (['add', 'unlink', 'change'].includes(event) === false) return
      console.info(`shared schemas ${event === 'add' ? 'added' : event === 'unlink' ? 'removed' : 'changed'}: \`${relative(nuxt.options.rootDir, path)}\``)
      schemasPaths = await getSchemasPaths()

      await updateTemplates({ filter: template => template.filename.includes('registry/schemas.entry.ts') })
      await buildSharedSchemas(nuxt.options.buildDir, { relativeDir: nuxt.options.rootDir, alias: nuxt.options.alias })
    })
    nuxt.hook('close', () => watcher.close())
  }
  console.info({ schemasPaths })
  // Generate final database schema file at .nuxt/registry/schemas.entry.ts
  addTemplate({
    filename: 'registry/schemas.entry.ts',
    getContents: () => {
      const imports = schemasPaths.map((path, i) => `import * as _${i} from '${path}'`).join('\n')
      const spread = schemasPaths.map((_, i) => `..._${i}`).join(', ')
      return `${imports}\n\nexport const schemas = { ${spread} }`
    },
    write: true
  })

  // Initial build
  await buildSharedSchemas(nuxt.options.buildDir, { relativeDir: nuxt.options.rootDir, alias: nuxt.options.alias })
}

export async function buildSharedSchemas(buildDir: string, { relativeDir, alias }: { relativeDir?: string, alias?: Record<string, string> } = {}) {
  const startTime = Date.now()
  relativeDir = relativeDir || buildDir
  const entry = join(buildDir, 'registry/schemas.entry.ts')
  await build({
    entry: {
      schemas: entry
    },
    outDir: join(buildDir, 'registry'),
    outExtensions: () => ({
      js: '.mjs',
      dts: '.d.mts'
    }),
    alias: {
      ...alias,
      '@registry/schemas': entry
    },
    platform: 'neutral',
    format: 'esm',
    skipNodeModulesBundle: false,
    tsconfig: false,
    dts: {
      build: false,
      tsconfig: false,
      newContext: true
    },
    clean: false,
    logLevel: 'warn'
  })
  const duration = Date.now() - startTime
  console.debug(`shared schemas built successfully at \`${relative(relativeDir, join(buildDir, 'registry/schemas.mjs'))}\` (${duration}ms)`)
}
