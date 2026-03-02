import type { Nuxt } from '@nuxt/schema'
import { getLayerDirectories, updateTemplates, addTemplate } from '@nuxt/kit'
import { join, resolve as resolveFs, relative } from 'pathe'
import { glob } from 'tinyglobby'
import chokidar from 'chokidar'
import { build } from 'tsdown'

export async function setupOrm(nuxt: Nuxt) {
// Handle ORM
  nuxt.hook('modules:done', async () => {
    // generate orm registry
    await generateOrmRegistry(nuxt)
  })
}

async function generateOrmRegistry(nuxt: Nuxt) {
  const getOrmPaths = async () => {
    const ormPatterns = getLayerDirectories(nuxt).map(layer => [
      resolveFs(layer.server, 'db/orm/*.{ts,js,mjs,cjs}').replace(/\\/g, '/'),
      resolveFs(layer.server, 'db/orm/*/index.{ts,js,mjs,cjs}').replace(/\\/g, '/')
    ]).flat()

    const ormPaths = await glob(ormPatterns, { absolute: true, onlyFiles: true })

    console.info({ ormPatterns })
    console.info({ ormPaths })

    return ormPaths
  }

  let ormPaths = await getOrmPaths()

  // Watch orm files for changes
  if (nuxt.options.dev && !nuxt.options._prepare) {
    const watchDirs = getLayerDirectories(nuxt).map(layer => resolveFs(layer.server, 'db/orm'))
    const watcher = chokidar.watch(watchDirs, {
      ignoreInitial: true
    })
    watcher.on('all', async (event, path) => {
      if (['add', 'unlink', 'change'].includes(event) === false) return
      console.info(`ORM file ${event === 'add' ? 'added' : event === 'unlink' ? 'removed' : 'changed'}: \`${relative(nuxt.options.rootDir, path)}\``)
      ormPaths = await getOrmPaths()

      await updateTemplates({ filter: template => template.filename.includes('registry/orm.entry.ts') })
      await buildOrmRegistry(nuxt.options.buildDir, { relativeDir: nuxt.options.rootDir, alias: nuxt.options.alias })
    })
    nuxt.hook('close', () => watcher.close())
  }

  // Generate final ORM registry file at .nuxt/registry/orm.entry.ts
  addTemplate({
    filename: 'registry/orm.entry.ts',
    getContents: () => {
      const imports = ormPaths.map((path, i) => `import * as _${i} from '${path}'`).join('\n')
      const spread = ormPaths.map((_, i) => `..._${i}`).join(', ')
      return `${imports}\n\nexport const orm = { ${spread} }`
    },
    write: true
  })

  // Initial build
  await buildOrmRegistry(nuxt.options.buildDir, { relativeDir: nuxt.options.rootDir, alias: nuxt.options.alias })
}

export async function buildOrmRegistry(buildDir: string, { relativeDir, alias }: { relativeDir?: string, alias?: Record<string, string> } = {}) {
  const startTime = Date.now()
  relativeDir = relativeDir || buildDir
  const entry = join(buildDir, 'registry/orm.entry.ts')
  await build({
    entry: {
      orm: entry
    },
    outDir: join(buildDir, 'registry'),
    outExtensions: () => ({
      js: '.mjs',
      dts: '.d.mts'
    }),
    alias: {
      ...alias,
      '@registry/orm': entry
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
  console.debug(`ORM registry built successfully at \`${relative(relativeDir, join(buildDir, 'registry/orm.mjs'))}\` (${duration}ms)`)
}
