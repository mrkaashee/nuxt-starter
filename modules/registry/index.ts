// `nuxt/kit` is a helper subpath import you can use when defining local modules
// that means you do not need to add `@nuxt/kit` to your project's dependencies
import { addComponentsDir, addServerHandler, createResolver, defineNuxtModule } from 'nuxt/kit'
import { setupSchemas } from './schemas/setup'

// export interface ModuleHooks {
//   'registry:schemas:extend': (paths: string[]) => void | Promise<void>
// }

export default defineNuxtModule({
  meta: {
    name: 'registry',
  },
  async setup(options, nuxt) {
    console.log('Registry is loaded!')
    // const resolver = createResolver(import.meta.url)

    await setupSchemas(nuxt)
  },
})
