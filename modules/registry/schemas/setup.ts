import type { Nuxt } from '@nuxt/schema'
import { getLayerDirectories, updateTemplates, addTemplate } from '@nuxt/kit'
import { resolve as resolveFs, relative } from 'pathe'
import { glob } from 'tinyglobby'
import chokidar from 'chokidar'

export async function setupSchemas(nuxt: Nuxt) {
  const getSchemasPaths = async () => {
    const schemasPatterns = getLayerDirectories(nuxt).map(layer => [
      resolveFs(layer.shared, 'schemas/*.{ts,js,mjs,cjs}').replace(/\\/g, '/'),
      resolveFs(layer.shared, 'schemas/*/index.{ts,js,mjs,cjs}').replace(/\\/g, '/')
    ]).flat()

    const schemasPaths = await glob(schemasPatterns, { absolute: true, onlyFiles: true })
    console.info({ schemasPatterns })
    console.info({ schemasPaths })
    return schemasPaths
  }

  const schemasPaths = await getSchemasPaths()

  const getEntryContent = () => {
    const imports = schemasPaths.map((path, i) => `import * as _${i} from '${path.replace(/\\/g, '/')}'`).join('\n')
    const spread = schemasPaths.map((_, i) => `..._${i}`).join(', ')
    return `${imports}\n\nexport const schemas = { ${spread} }`
  }

  // Write schemas.ts — compiled by Nitro/Vite during its own build step
  addTemplate({
    filename: 'registry/schemas.ts',
    getContents: getEntryContent,
    write: true,
  })

  // In dev mode, watch for file changes and trigger template rebuild
  if (nuxt.options.dev && !nuxt.options._prepare) {
    nuxt.hook('modules:done', () => {
      setupSchemasWatcher(nuxt)
    })
  }
}

function setupSchemasWatcher(nuxt: Nuxt) {
  const watchDirs = getLayerDirectories(nuxt).map(layer => resolveFs(layer.shared, 'schemas'))
  const watcher = chokidar.watch(watchDirs, { ignoreInitial: true })
  watcher.on('all', async (event, path) => {
    if (!['add', 'unlink', 'change'].includes(event)) return
    console.info(`shared schemas ${event === 'add' ? 'added' : event === 'unlink' ? 'removed' : 'changed'}: \`${relative(nuxt.options.rootDir, path)}\``)
    await updateTemplates({ filter: template => template.filename === 'registry/schemas.ts' })
  })
  nuxt.hook('close', () => watcher.close())
}
