import { accounts as accountsSchema } from '@nuxthub/db/schema'
import { createInsertSchema } from 'drizzle-orm/zod'

const base = createInsertSchema(accountsSchema)

export const accounts = {
  create: base,
  register: base.pick({ username: true, password: true }),
  login: base.pick({ username: true, password: true }),
}
