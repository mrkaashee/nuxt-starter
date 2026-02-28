import type { seo, accounts } from '@nuxthub/db/schema'

export type Seo = typeof seo.$inferSelect
export type NewSeo = typeof seo.$inferInsert

export type Account = typeof accounts.$inferSelect
export type NewAccount = typeof accounts.$inferInsert
