import type { Nuxt } from '@nuxt/schema'
import { getLayerDirectories, updateTemplates, addTemplate } from '@nuxt/kit'
import { resolve as resolveFs, relative } from 'pathe'
import { glob } from 'tinyglobby'
import chokidar from 'chokidar'

export async function setupOrm(nuxt: Nuxt) {
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

  const ormPaths = await getOrmPaths()

  const getEntryContent = () => {
    const imports = ormPaths.map((path, i) => `import * as _${i} from '${path.replace(/\\/g, '/')}'`).join('\n')
    const spread = ormPaths.map((_, i) => `..._${i}`).join(', ')
    return `${imports}\n\nexport const orm = { ${spread} }`
  }

  // Write the bundler entry (re-exported by Nitro, which handles auto-imports)
  addTemplate({
    filename: 'registry/orm.ts',
    getContents: getEntryContent,
    write: true,
  })

  // In dev mode, watch for file changes and rebuild
  if (nuxt.options.dev && !nuxt.options._prepare) {
    nuxt.hook('modules:done', () => {
      setupOrmWatcher(nuxt, getOrmPaths)
    })
  }
}

function setupOrmWatcher(nuxt: Nuxt, _getOrmPaths: () => Promise<string[]>) {
  const watchDirs = getLayerDirectories(nuxt).map(layer => resolveFs(layer.server, 'db/orm'))
  const watcher = chokidar.watch(watchDirs, { ignoreInitial: true })
  watcher.on('all', async (event, path) => {
    if (!['add', 'unlink', 'change'].includes(event)) return
    console.info(`ORM file ${event === 'add' ? 'added' : event === 'unlink' ? 'removed' : 'changed'}: \`${relative(nuxt.options.rootDir, path)}\``)
    await updateTemplates({ filter: template => template.filename === 'registry/orm.ts' })
  })
  nuxt.hook('close', () => watcher.close())
}
