import { accounts } from '@nuxthub/db/schema'
import { createInsertSchema } from 'drizzle-zod'

const base = createInsertSchema(accounts)

export default {
  create: base,
  register: base.pick({ username: true, password: true }),
  login: base.pick({ username: true, password: true }),
}
