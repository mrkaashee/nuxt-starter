import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { _timestamps, _uuid } from '../_db'

export const seo = sqliteTable('seo', {
  ..._uuid,

  // Route path
  route: text().unique().notNull(),

  // Basic SEO
  title: text(),
  description: text(),
  keywords: text({ mode: 'json' }).$type<string[]>(),

  ..._timestamps
})
