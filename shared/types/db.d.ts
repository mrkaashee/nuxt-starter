import type { seo } from '@nuxthub/db/schema'

export type Seo = typeof seo.$inferSelect
export type NewSeo = typeof seo.$inferInsert
