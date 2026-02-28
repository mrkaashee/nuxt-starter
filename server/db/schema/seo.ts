import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { _timestamps, _uuid } from '../_db'

export const seo = sqliteTable('seo', {
  ..._uuid,

  // Route path
  route: text('route').unique().notNull(),

  // Basic SEO
  title: text('title'),
  description: text('description'),
  keywords: text('keywords', { mode: 'json' })
    .$type<string[]>(),

  canonicalUrl: text('canonical_url'),
  robots: text('robots').default('index,follow'),

  // Open Graph
  ogTitle: text('og_title'),
  ogDescription: text('og_description'),
  ogImg: text('og_img'),

  // Twitter
  twitterImg: text('twitter_img'),

  ..._timestamps
})
